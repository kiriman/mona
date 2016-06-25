<?php
// session_start();
// if (!isset($_SESSION['count'])) {
//     $_SESSION['count'] = 0;
// }
// $_SESSION['count']++;

// echo "Hello #" . $_SESSION['count'] . " session_id: ".session_id();

$hostname = "m60mxazb4g6sb4nn.chr7pe7iynqr.eu-west-1.rds.amazonaws.com";
$username = "k47xels8p95j4de2";
$password = "ym3yolj7pmkr4md4";
$database = "qwtyyvmxd9kj0xdi";
$charset = "utf8";

$dsn = "mysql:host=$hostname;dbname=$database;charset=$charset";
$options = array(
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
);
$pdo = new PDO($dsn, $username, $password, $options);

$isAdmin = function () use($pdo) {
    $session_id = "ap4c59u8ocrur9tnvchs69gfh7";
    $stmt = $pdo->prepare('SELECT * FROM users WHERE session_id = :session_id LIMIT 1');
    $stmt->execute(array('session_id' => $session_id));
    // $r = $stmt->fetch();
    // print_r($r);
    return $stmt->fetch();

    // if($r){
    // 	echo "\n".$r['password']."\n";
    // 	echo "true\n";
    // }else{
    // 	echo "false\n";
    // }
};
// $user = $isAdmin();
// if($user){
//     echo "\ntrue\n";
// }else{
//     echo "\nfalse\n";
// }

$query='UPDATE comments SET name = :name, email = :email, image = :image, text = :text WHERE id = :id';
$stmt = $pdo->prepare($query);
$stmt->execute(
    array(
        'name' => 'lll',
        'email' => 'emem',
        'text' => 'ttt',
        'id' => 3,
        'image' => 'filename'
        )
    );


// echo "user: ".print_r($user['login']);

// $sql = "select * from `$table`".($key?" WHERE id=$key":'');
// $sql = "update `$table` set $set where id=$key";
// $sql = "insert into `$table` set $set";
// $sql = "delete `$table` where id=$key";
?>