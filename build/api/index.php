<?php
require_once __DIR__.'/../../vendor/autoload.php';

$app = new Silex\Application();

$app['debug'] = true;

$app->get('/hello', function () {
    return 'Hello world!';
});

$blogPosts = array(
    1 => array(
        'date'      => '2011-03-29',
        'author'    => 'igorw',
        'title'     => 'Using Silex',
        'body'      => '...',
    ),
);

$app->get('/blog', function () use ($blogPosts) {
    $output = '';
    foreach ($blogPosts as $post) {
        $output .= $post['title'];
        $output .= '<br />';
    }
    return $output;
});

$app->run();

?>