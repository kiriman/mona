<?php
session_start();
// $session_id = session_id();

/*
    CONFIG: connect to MySQL
*/
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


/*
    API
*/

// get the HTTP method, path and body of the request

$method = $_SERVER['REQUEST_METHOD'];
$request = explode('/', trim($_SERVER['PATH_INFO'],'/'));
$input = json_decode(file_get_contents('php://input'),true);

$request_uri = $_SERVER['REQUEST_URI'];
// print_r($method);
print_r($request);
print_r($request_uri);
// print_r($input);

// $stmt = prepare('SELECT name FROM users WHERE email = :email');
// $stmt->execute(array('email' => $email));

function isAdmin($pdo){
    $session_id = "12345777";
    $stmt = $pdo->prepare('SELECT * FROM users WHERE session_id = :session_id LIMIT 1');
    $stmt->execute(array('session_id' => $session_id));
    if( $stmt->fetch() ){
        return true;
    }else{
        return false;
    }
}

// create SQL based on HTTP method

switch ($method) {
  case 'GET':
    // $sql = "select * from `$table`".($key?" WHERE id=$key":'');
    switch ($request[0]) {
        case 'comments':
            $query='SELECT * FROM comments WHERE is_moderated = 1';
            if( isAdmin($pdo) ){
                $query='SELECT * FROM comments';
            }

            $stmt = $pdo->prepare($query);
            $stmt->execute();
            echo json_encode( $stmt->fetchAll() );
        break;
    }
    break;
  case 'PUT':
    // $sql = "update `$table` set $set where id=$key";
    break;
  case 'POST':
    // $sql = "insert into `$table` set $set";
    break;
  case 'DELETE':
    // $sql = "delete `$table` where id=$key";
    break;
}
// $stmt->closeCursor();
$pdo = null;

//logout session_destroy();

// if($_SESSION['counter']>3){
//     unset($_SESSION['counter']);
//     // session_unregister('var');
// }
//////////////////////////////////////////////////////
// Silex
//////////////////////////////////////////////////////

// require_once __DIR__.'/../../vendor/autoload.php';

// $app = new Silex\Application();

// $app['debug'] = true;

// $app->get('/hello', function () {
//     return 'Hello world!';
// });

// $blogPosts = array(
//     0 => array(
//         'date'      => '2011-03-28',
//         'author'    => 'kir',
//         'title'     => 'Using PHP',
//         'body'      => 'body1...',
//     ),
//     1 => array(
//         'date'      => '2011-03-29',
//         'author'    => 'igorw',
//         'title'     => 'Using Silex',
//         'body'      => 'body2...',
//     )
// );

// $app->get('/blog', function () use ($blogPosts) {
//     $output = '';
//     foreach ($blogPosts as $post) {
//         $output .= $post['title'];
//         $output .= '<br />';
//     }
//     return $output;
// });

// $app->get('/comments', function ($id) use ($blogPosts) {
//     $output = json_encode($blogPosts);
//     return $output;
// });

// $app->get('/login={id}', function ($id){
//     $output = $id;
//     return $output;
// });

// $app->run();

?>