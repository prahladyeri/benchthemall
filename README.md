Bench Them All!
===============

This repo aims to add a collection of scripts written in various languages (presently only php) written to benchmark performance of various server platforms from a single client.

Each script gauges performance based on the following three values:

1. Disk I/O performance.
2. DB performance (mysql).
3. DB performance (sqlite).

Besides, the client can make the requests several times even concurrently so that it can gauge the network speed a.k.a requests/sec. Each script sends back a response in json format containing the performance parameters  plus some additional info like this:

{"type":"disk","iterations":500,"generate_time":552,"write_time":1654,"read_time":45,"server_software":"Apache\/2.4.7 (Ubuntu)","payload":"payload"}

The ***iterations*** parameter refers to the number of times each benchmarking operation was performed. The default is 500, but can be changed in the script.

The ***type*** parameter refers to the type of test performed i.e. disk/mysql/sqlite. This is passed as a querystring parameter to the script (example: http://localhost/benchthemall/benchmark.php?type=sqlite). The default is assumed to be disk.

The ***write_time*** refers to:
1. In case of disk I/O, milliseconds to write the payload to file for 500 times.
2. In case of mysql, milliseconds to insert a payload record to a table for 500 times.
3. In case of sqlite, milliseconds to insert a payload record to a table for 500 times.

The ***payload*** is a randomly generated 108kb string generated for gauging the performance.

Based on the return value from the scripts, the client can easily gauge not only the network speed between the client and the remote server, but also the server's efficiency for performing I/O.
