<?php
session_start();

// https://devcenter.heroku.com/articles/php-sessions

header("Access-Control-Allow-Origin: http://93.88.210.4:3001");
header("Access-Control-Allow-Credentials: true");       
header("Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS");
// $_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS'])
// header("Access-Control-Allow-Headers: application/json");


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

// $request = explode('/', trim($_SERVER['PATH_INFO'],'/'));
$method = $_SERVER['REQUEST_METHOD'];
$request = explode('/', trim($_SERVER['REQUEST_URI'],'/'));
$input = json_decode(trim(file_get_contents('php://input')), true);//split to array
$response = [];

$isAdmin = function () use ($pdo) {
    // $session_id = "12345";
    $stmt = $pdo->prepare('SELECT * FROM users WHERE session_id = :session_id LIMIT 1');
    $stmt->execute( array( 'session_id' => session_id() ) );
    if( $stmt->fetch() ){
        return true;
    }else{
        return false;
    }
};
// $values = function () use ($input){
//     $arr = [];
//     foreach ($input as $key => $value) {
//         if($key != "id"){
//             $arr[$key] = $value;
//         }
//     }
//     return $arr;
// };

// create SQL based on HTTP method
switch ($method) {
    case 'GET':
        switch ($request[1]) {
            case 'comments':
                $query='SELECT * FROM comments WHERE is_moderated = 1';
                $response['isadmin'] = false;
                if( $isAdmin() ){
                    $query='SELECT * FROM comments';
                    $response['isadmin'] = true;
                }

                $stmt = $pdo->prepare($query);
                $stmt->execute();
                $response['status'] = true;
                $response['data'] = json_encode( $stmt->fetchAll() );
                echo json_encode( $response );
                // echo json_encode( $stmt->fetchAll() );

            break;
            case 'signout':
                $stmt = $pdo->prepare('SELECT * FROM users WHERE session_id = :session_id LIMIT 1');
                $stmt->execute( array( 'session_id' => session_id() ) );
                $user = $stmt->fetch();

                $query='UPDATE users SET session_id = :session_id WHERE id = :id';
                $stmt = $pdo->prepare($query);
                $stmt->execute(array('session_id' => '0', 'id' => $user['id'] ));

                $response['status'] = true;
                echo json_encode( $response );

            break;
        }
    break;

    case 'PUT':
        switch ($request[1]) {
            case 'comments':
                if( !$isAdmin() ){exit;};
                $id = $input['id'];
                $newText = $input['newText'];
                $query='UPDATE comments SET text = :newText, is_edited = :is_edited WHERE id = :id';
                $stmt = $pdo->prepare($query);
                $stmt->execute(array('newText' => $newText, 'is_edited' => '1', 'id' => $id));

                $response['status'] = true;
                echo json_encode( $response );
            break;
            case 'moderate':
                if( !$isAdmin() ){exit;};
                $id = $input['id'];
                $is_moderated = $input['is_moderated'];
                $query='UPDATE comments SET is_moderated = :is_moderated WHERE id = :id';
                $stmt = $pdo->prepare($query);
                $stmt->execute(array('is_moderated' => $is_moderated, 'id' => $id));

                $response['status'] = true;
                echo json_encode( $response );
            break;
        }
    break;

    case 'POST':
        switch ($request[1]) {
            case 'comments':
                if( !$isAdmin() ){exit;};
                $id = $input['id'];
                $newText = $input['newText'];
                $query='INSERT INTO comments SET name = :name, email = :email, text = :text';
                $stmt = $pdo->prepare($query);
                $stmt->execute(
                    array(
                        'login' => $input['name'],
                        'email' => $input['email'],
                        'text' => $input['text']
                        )
                    );

                $response['status'] = true;
                echo json_encode( $response );
            break;

            case 'signin':
                $query='SELECT * FROM users WHERE login = :login AND password = :password LIMIT 1';
                $stmt = $pdo->prepare($query);
                $stmt->execute(
                    array(
                        'login' => $input['login'],
                        'password' => $input['password']
                        )
                    );
                // $count = $stmt->rowCount();
                $user = $stmt->fetch();
                // if($count == 1){
                if($user){
                    $query='UPDATE users SET session_id = :session_id WHERE login = :login';
                    $stmt = $pdo->prepare($query);
                    $stmt->execute(array('session_id' => session_id(), 'login' => $user['login']));

                    $response['status'] = true;
                    $response['login'] = $user['login'];
                    // $response['isadmin'] = $user['is_admin'];
                    $response['session_id'] = session_id();
                }else{
                    $response['status'] = false;
                }
                echo json_encode( $response );
            break;
        }
    break;

    case 'DELETE':
        
    break;
}
// $stmt->closeCursor();
$pdo = null;

//logout session_destroy();

// if($_SESSION['counter']>3){
//     unset($_SESSION['counter']);
//     // session_unregister('var');
// }

?>