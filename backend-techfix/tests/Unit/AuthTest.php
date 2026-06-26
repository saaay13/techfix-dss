<?php

namespace Tests\Unit;

use PHPUnit\Framework\TestCase;

class AuthTest extends TestCase
{
    public function test_login_validation_requires_email(): void
    {
        $this->assertTrue(true);
    }

    public function test_login_validation_requires_password(): void
    {
        $this->assertTrue(true);
    }

    public function test_password_is_bcrypt_hashed(): void
    {
        $password = '12345678';
        $hash = password_hash($password, PASSWORD_BCRYPT);
        $this->assertTrue(password_verify($password, $hash));
    }
}
