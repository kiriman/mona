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
    $session_id = "q1clhkit4jkrqrg53ov61rb446";
    $stmt = $pdo->prepare('SELECT * FROM users WHERE session_id = :session_id LIMIT 1');
    $stmt->execute(array('session_id' => $session_id));
    $r = $stmt->fetch();
    print_r($r);
    if($r){
    	echo "\n".$r['password']."\n";
    	echo "true\n";
    }else{
    	echo "false\n";
    }
};
$isAdmin();

// $sql = "select * from `$table`".($key?" WHERE id=$key":'');
// $sql = "update `$table` set $set where id=$key";
// $sql = "insert into `$table` set $set";
// $sql = "delete `$table` where id=$key";
?>