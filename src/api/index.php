<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS");         
// $_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS'])
// header("Access-Control-Allow-Headers: application/json");

session_start();
// global $session_id = session_id();

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
// $request = explode('/', trim($_SERVER['PATH_INFO'],'/'));
$request = explode('/', trim($_SERVER['REQUEST_URI'],'/'));
$input = json_decode(trim(file_get_contents('php://input')), true);//split to array
$response = [];

// print_r($method);
// print_r($request);
// print_r($input);

// $stmt = prepare('SELECT name FROM users WHERE email = :email');
// $stmt->execute(array('email' => $email));

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

// create SQL based on HTTP method
switch ($method) {
    case 'GET':
        // $sql = "select * from `$table`".($key?" WHERE id=$key":'');
        switch ($request[1]) {
            case 'comments':
                // $query='SELECT * FROM comments WHERE is_moderated = 1';
                // if( $isAdmin() ){
                //     $query='SELECT * FROM comments';
                // }

                // $stmt = $pdo->prepare($query);
                // $stmt->execute();
                // echo json_encode( $stmt->fetchAll() );
                echo session_id();
            break;
        }
    break;

    case 'PUT':
        // $sql = "update `$table` set $set where id=$key";
        switch ($request[1]) {
            case 'comments':
                if( !$isAdmin() ){exit;};
                $id = $input['id'];
                $newText = $input['newText'];
                $query='UPDATE comments SET text = :newText WHERE id = :id';
                $stmt = $pdo->prepare($query);
                $stmt->execute(array('newText' => $newText, 'id' => $id));

                $response['status'] = true;
                echo json_encode( $response );
            break;
        }
    break;

    case 'POST':
        // $sql = "insert into `$table` set $set";
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
                $count = $stmt->rowCount();
                if($count == 1){
                    $query='UPDATE users SET session_id = :session_id WHERE login = :login';
                    $stmt = $pdo->prepare($query);
                    $stmt->execute(array('session_id' => session_id(), 'login' => $input['login']));

                    $response['status'] = true;
                    $response['login'] = $input['login'];
                    $response['session_id'] = session_id();
                }else{
                    $response['status'] = false;
                }
                echo json_encode( $response );
            break;
        }
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

?>