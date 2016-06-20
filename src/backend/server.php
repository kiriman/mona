<?php
echo "server echo test\n";
/*
	CONFIG: connect to MySQL
*/
$hostname = "m60mxazb4g6sb4nn.chr7pe7iynqr.eu-west-1.rds.amazonaws.com";
$username = "k47xels8p95j4de2";
$password = "ym3yolj7pmkr4md4";
$database = "qwtyyvmxd9kj0xdi";

$db = new mysqli($hostname, $username, $password, $database);
/* проверка соединения */
if (mysqli_connect_errno()) {
    printf("Не удалось подключиться: %s\n", mysqli_connect_error());
    exit();
}
/* изменение набора символов на utf8 */
if (!$db->set_charset("utf8")) {
    printf("Ошибка при загрузке набора символов utf8: %s\n", $db->error);
} else {
    printf("Текущий набор символов: %s\n", $db->character_set_name());
}

$params = json_decode(trim(file_get_contents('php://input')), true);//split to array
$q = $params['q'];

echo "server echo: ".$q;

// || $result->num_rows
// $result = $db->query("SELECT * FROM qwtyyvmxd9kj0xdi.comments");
// if($result){
//      // Cycle through results
//     while ($row = $result->fetch_object()){
//         $user_arr[] = $row;
//     }
//     // Free result set
//     $result->close();
//     $db->next_result();
// }
// print_r($user_arr);

$db->close();


// $fname = mysql_real_escape_string($params['fname']);

?>