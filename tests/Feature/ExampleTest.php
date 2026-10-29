<?php

test('root redirects to robokreasi workspace', function () {
    $response = $this->get('/');

    $response->assertRedirect('/robokreasi');
});
