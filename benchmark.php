<?php
/**
 * @file: benchmark.php
 * @description: script used to benchmark php setup
 * @author: Prahlad Yeri
 * @copyright: MIT Licensed
 * @version: 1.02
 * 
 * */

$mysqlserver = 'localhost';
$mysqlusername = 'test';
$mysqlpassword='test';
$mysqldatabase='test';

$iterations=500;
$payload=""; //generate a random string of 108KB and a random filename
$fname='';
$rtime=0; //in milliseconds
$wtime=0;
$gentime=0;
$type='';

$db = null;
$mysqli = null;

if (isset($_REQUEST['type'])) $type=$_REQUEST['type'];

//generate:
$start = microtime(true);
for($i=0;$i<108000;$i++) //generate a big string
{
	$n=rand(0,57)+65;
	$payload = $payload.chr($n);
}
$gentime=round((microtime(true) - $start)*1000);


//write test:
$start = microtime(true);
	if ($type=='sqlite') //sqlite test
	{
		$db = new SQLite3("benchmark.db");
		$db->exec('create table temp(t text)');
		$db->exec("begin");
		$stmt = $db->prepare("insert into temp values(:id)");
		for($i=0;$i<$iterations;$i++) {
			$stmt->bindValue(':id', $payload, SQLITE3_TEXT);
			$stmt->execute();
			//$db->exec("delete from temp");
			};
		$db->exec("commit");
		
	}
	else if ($type=='mysql') //mysql test
	{
		$mysqli = new mysqli($mysqlserver, $mysqlusername, $mysqlpassword, $mysqldatabase);
		$mysqli->query('create table temp(t varchar(108000))');
		$mysqli->query('begin transaction');
		for($i=0;$i<$iterations;$i++) 
			$mysqli->query("insert into temp values('{$payload}')");
		$mysqli->query('commit');
	}
	else // Disk I/O
	{
		$fname = chr(rand(0,57)+65).chr(rand(0,57)+65).chr(rand(0,57)+65).chr(rand(0,57)+65).'.txt';
		for($i=0;$i<$iterations;$i++) file_put_contents($fname,$payload);
	}
$wtime=round((microtime(true) - $start)*1000);

//read test:
$start = microtime(true);
$result = '';
if ($type=='sqlite'){
	for($i=0;$i<$iterations;$i++) {
		$result = $db->query("select t from temp limit 1");
		$result = $result->fetchArray()['t'];
		//$db->exec("delete from temp");
	};
		//var_dump($result);
}
else if ($type=='mysql'){
	$stmt = $mysqli->prepare('select t from temp limit 1');
	if ($stmt) 
	{
		for($i=0;$i<$iterations;$i++) {
			$stmt->execute();
			$stmt->bind_result($result);
			$stmt->fetch();
		};
	}
}
else
{
	for($i=0;$i<$iterations;$i++) $result = file_get_contents($fname);
}
$rtime=round((microtime(true) - $start)*1000);

//cleanup:	
if ($type=='sqlite') 
{
		$db->exec("drop table temp");
		$db->close();
}
else if ($type=='mysql') 
{
	$mysqli->query('drop table temp');
}
else 
{
	unlink($fname);
}

//return:
$result =  array(
	'type'=>($type==''?'disk':$type),
	'iterations'=>$iterations,
	'generate_time'=>$gentime,
	'write_time'=>$wtime,
	'read_time'=>$rtime,
	'server_software'=>$_SERVER["SERVER_SOFTWARE"],
	'payload'=>$result,
);

echo json_encode($result);
