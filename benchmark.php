<?php
/**
 * @file: benchmark.php
 * @description: script used to benchmark php setup
 * @author: Prahlad Yeri
 * @copyright: MIT Licensed
 * @version: 1.0.57
 * */
$version="1.0.57";

require_once('config.php');

$script_version='1.0.14';
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
	//$n=rand(0,57)+65; //A-z
	$n=rand(0,15)+97; //a-z
	$payload = $payload.chr	($n);
}
$gentime=round((microtime(true) - $start)*1000);


//write test:
$start = microtime(true);
	if ($type=='sqlite2') //sqlite test
	{
		$db = sqlite_open('benchmark.db',0666);
		sqlite_query($db, 'create table temp(t text)');
		sqlite_query($db, "begin");
		for($i=0;$i<$iterations;$i++) {
			sqlite_exec($db, "insert into temp values('{$payload}')");
			};
		sqlite_query($db, "commit");
	}
	else if ($type=='sqlite3') //sqlite3 test
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
		//die("created table and begun trans!");
		for($i=0;$i<$iterations;$i++) 
			$mysqli->query("insert into temp values('{$payload}')");
		$mysqli->query('commit');
		//die("committed!");
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
if ($type=='sqlite2'){
	for($i=0;$i<$iterations;$i++) {
		$query = sqlite_query($db,"select t from temp limit 1");
		$result = sqlite_fetch_array($query);
		//$result = $result->fetchArray();
		$result = $result['t'];
	};
}
else if ($type=='sqlite3'){
	for($i=0;$i<$iterations;$i++) {
		$result = $db->query("select t from temp limit 1");
		$result = $result->fetchArray();
		$result = $result['t'];
	};
}
else if ($type=='mysql'){
	$stmt = $mysqli->prepare('select t from temp limit 1');
	if ($stmt) 
	{
		//die("prepared successfully! now looping");
		for($i=0;$i<$iterations;$i++) {
			$stmt->execute();
			$stmt->bind_result($result);
			$stmt->fetch();
		};
		$stmt->close();
	}
}
else
{
	for($i=0;$i<$iterations;$i++) $result = file_get_contents($fname);
}
$rtime=round((microtime(true) - $start)*1000);

//cleanup:	
if ($type=='sqlite2') 
{
		sqlite_query($db, "drop table temp");
		//$db->close();
		sqlite_close($db);
}
else if ($type=='sqlite3') 
{
		$db->exec("drop table temp");
		$db->close();
}
else if ($type=='mysql') 
{
	//$mysqli->query('begin');
	if (!$mysqli->query('drop table temp;')) echo 'drop failed';
	//$mysqli->query('commit');
	$mysqli->close();
		//die("cleaned up!");
}
else 
{
	unlink($fname);
}

//return:
$result =  array(
	'script_version'=>$script_version,
	'type'=>($type==''?'disk':$type),
	'iterations'=>$iterations,
	'generate_time'=>$gentime,
	'write_time'=>$wtime,
	'read_time'=>$rtime,
	'HTTP_HOST'=>$_SERVER["HTTP_HOST"],
	'server_software'=>$_SERVER["SERVER_SOFTWARE"],
	'php_version'=>phpversion(),
	'mysql_host'=>$mysqlserver,
	'payload'=>$result,
);


/*$result =  array(
	'payload'=>$result,
);*/


		//die("result prepared!");

echo json_encode($result);
//echo gettype($result);

