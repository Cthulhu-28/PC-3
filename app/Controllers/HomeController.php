<?php

namespace App\Controllers;


class HomeController extends Controller
{
    public function index($request, $response)
    {
        return $this->container->view->render($response, 'home.twig');
    }

    public function country($request, $response, $args)
    {
        $country = $args['country'];
        $code = $args['code'];
        return $this->container->view->render($response, 'country.twig', [
            'country' => $country,
            'code' => $code
        ]);
    }
}
