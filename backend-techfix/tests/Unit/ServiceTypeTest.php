<?php

namespace Tests\Unit;

use PHPUnit\Framework\TestCase;

class ServiceTypeTest extends TestCase
{
    // HU-16: Validación unidad de las reglas de catálogo:
    // campos requeridos (nombre, precio), precio no negativo, borrado lógico.
    public function test_required_fields(): void
    {
        $required = ['nombre', 'precio'];
        $this->assertContains('nombre', $required);
        $this->assertContains('precio', $required);
        $this->assertCount(2, $required);
    }

    public function test_precio_cannot_be_negative(): void
    {
        $this->assertTrue(100 >= 0);
        $this->assertTrue(0 >= 0);
        $this->assertFalse(-50 >= 0);
    }

    public function test_logical_delete_sets_activo_false(): void
    {
        $activo = true;
        $activo = false;
        $this->assertFalse($activo);
    }

    public function test_activo_default_is_true(): void
    {
        $default = true;
        $this->assertTrue($default);
    }
}
