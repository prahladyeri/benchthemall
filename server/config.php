<?php
/**
 * @file: benchmark.php
 * @description: script used to benchmark php setup
 * @author: Prahlad Yeri
 * @copyright: MIT Licensed
 * */
 
/*ini_set( 'display_errors',1);
ini_set( 'display_startup_errors' ,1);
ini_set( 'html_errors' ,1);*/

$iterations=50; //500;

if ($_SERVER['HTTP_HOST'] == 'localhost'){
	$mysqlserver = "localhost"; //'localhost';
	$mysqlusername = 'test';
	$mysqlpassword='test';
	$mysqldatabase="test"; //'test';
	
	}
else{
	/*openshift - sqlite3
	
	$mysqlserver = getenv('OPENSHIFT_MYSQL_DB_HOST'); //. ':' . getenv('OPENSHIFT_MYSQL_DB_PORT'); //127.8.185.2:3306
	$mysqlusername = getenv('OPENSHIFT_MYSQL_DB_USERNAME'); //adminXjgxfp7
	$mysqlpassword=getenv('OPENSHIFT_MYSQL_DB_PASSWORD'); //JRxjcPz8r98H
	$mysqldatabase=getenv('OPENSHIFT_APP_NAME'); //eyeon
*/

	/*byethost - sqlite3
	$mysqlserver = "sql100.byethost17.com"; //'localhost';
	$mysqlusername = 'b17_13777204';
	$mysqlpassword='blessings4all';
	$mysqldatabase="b17_13777204_test"; //23041"; //'test';
	*/
	
	/*000webhost - sqlite2
	$mysqlserver = "mysql5.000webhost.com"; //'localhost';
	$mysqlusername = 'a1235141_cgm';
	$mysqlpassword='wld123';
	$mysqldatabase="a1235141_cgm"; //'test';
	

	/*awardspace - sqlite2
	$mysqlserver = "fdb6.awardspace.net"; //'localhost';
	$mysqlusername = '1684992_test';
	$mysqlpassword='benchy1234';
	$mysqldatabase="1684992_test"; //'test';
	*/
	

}


