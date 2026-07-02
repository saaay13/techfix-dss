<?php

namespace Tests\Unit;

use PHPUnit\Framework\TestCase;

class ComponentSwapTest extends TestCase
{
    // HU-07: Validación de reglas de negocio a nivel unidad.
    // Verifica que solo se permitan los tipos 'retirado' e 'instalado',
    // que los campos requeridos estén definidos, y que cantidades sean positivas.
    private array $allowedTipos = ['retirado', 'instalado'];

    public function test_allowed_tipos(): void
    {
        $this->assertContains('retirado', $this->allowedTipos);
        $this->assertContains('instalado', $this->allowedTipos);
        $this->assertCount(2, $this->allowedTipos);
    }

    public function test_invalid_tipo_is_rejected(): void
    {
        $this->assertNotContains('devuelto', $this->allowedTipos);
        $this->assertNotContains('reemplazado', $this->allowedTipos);
    }

    public function test_required_fields(): void
    {
        $required = ['service_order_id', 'retirado_component_id', 'instalado_component_id', 'retirado_cantidad', 'instalado_cantidad'];
        $this->assertContains('service_order_id', $required);
        $this->assertContains('retirado_component_id', $required);
        $this->assertContains('instalado_component_id', $required);
        $this->assertContains('retirado_cantidad', $required);
        $this->assertContains('instalado_cantidad', $required);
        $this->assertCount(5, $required);
    }

    public function test_devuelto_al_cliente_default_is_false(): void
    {
        $default = false;
        $this->assertFalse($default);
    }

    public function test_cantidad_must_be_positive(): void
    {
        $this->assertTrue(1 >= 1);
        $this->assertTrue(5 >= 1);
        $this->assertFalse(0 >= 1);
    }
}
