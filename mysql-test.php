<?php
require_once('config.php');
//$mysqli = new mysqli($mysqlserver, $mysqlusername, $mysqlpassword, $mysqldatabase);
$mysqli = new mysqli($mysqlserver, $mysqlusername, $mysqlpassword, $mysqldatabase);

$link = $mysqli;
/* check connection */
if (mysqli_connect_errno()) {
    printf("Connect failed: %s\n", mysqli_connect_error());
    exit();
}

if (!mysqli_query($link, "SET a=1")) {
    printf("Errormessage: %s\n", mysqli_error($link));
}


$mysqli->query('create table toto(t mediumtext)');
//mysqli_query($mysqli,'begin transaction');
//for($i=0;$i<$iterations;$i++) 
//	$mysqli->query("insert into temp values('{$payload}')");
//mysqli_query($mysqli,'commit');
//echo 'mysql works!';

	mysqli_query($mysqli,'begin transaction');
	mysqli_query($mysqli,"insert into toto values('zzzz')");
	mysqli_query($mysqli,'begin transaction');


	//$stmt = $mysqli->prepare('select t from toto limit 1');
	$result='none';
	$stmt = mysqli_prepare($mysqli,'select t from toto limit 1');
	if ($stmt) 
	{
			//$stmt->execute();
			//$stmt->bind_result($result);
			//$stmt->fetch();
			mysqli_stmt_execute($stmt);
			mysqli_stmt_bind_result($stmt,$result);
			mysqli_stmt_fetch($stmt);
	}

echo 'mysql select also works. it is: '. $result;
echo 'used: ';
echo var_dump(array($mysqlserver, $mysqlusername, $mysqlpassword, $mysqldatabase));
