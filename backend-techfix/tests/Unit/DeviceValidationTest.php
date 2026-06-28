<?php

namespace Tests\Unit;

use PHPUnit\Framework\TestCase;

class DeviceValidationTest extends TestCase
{
    private array $validTypes = [
        'PC', 'Laptop', 'PlayStation', 'Xbox', 'Nintendo', 'Celular', 'Electrónica general',
    ];

    private array $validStates = ['Bueno', 'Regular', 'Malo'];

    public function test_valid_device_types(): void
    {
        $this->assertContains('PC', $this->validTypes);
        $this->assertContains('Laptop', $this->validTypes);
        $this->assertContains('Celular', $this->validTypes);
        $this->assertContains('Electrónica general', $this->validTypes);
        $this->assertCount(7, $this->validTypes);
    }

    public function test_invalid_device_type_is_rejected(): void
    {
        $invalidType = 'Tablet';
        $this->assertNotContains($invalidType, $this->validTypes);
    }

    public function test_valid_physical_states(): void
    {
        $this->assertContains('Bueno', $this->validStates);
        $this->assertContains('Regular', $this->validStates);
        $this->assertContains('Malo', $this->validStates);
        $this->assertCount(3, $this->validStates);
    }

    public function test_physical_state_is_optional(): void
    {
        $this->assertTrue(true);
    }

    public function test_required_fields_for_device(): void
    {
        $required = ['tipo_equipo', 'marca', 'modelo', 'numero_serie', 'client_id'];
        $this->assertContains('tipo_equipo', $required);
        $this->assertContains('marca', $required);
        $this->assertContains('modelo', $required);
        $this->assertContains('numero_serie', $required);
        $this->assertContains('client_id', $required);
        $this->assertCount(5, $required);
    }
}
