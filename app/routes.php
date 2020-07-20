<?php

$app->get('/', \App\Controllers\HomeController::class . ':index')->setName('home');
$app->get('/{country}/{code}', \App\Controllers\HomeController::class . ':country')->setName('country');
