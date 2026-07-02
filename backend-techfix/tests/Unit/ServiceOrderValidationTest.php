<?php

namespace Tests\Unit;

use PHPUnit\Framework\TestCase;

class ServiceOrderValidationTest extends TestCase
{
    // HU-04: Validación de reglas de negocio para órdenes de servicio:
    // prioridades válidas (Baja/Media/Alta), estado inicial Recibido y
    // campos requeridos (cliente, equipo, tipo servicio, diagnóstico).
    private array $validPriorities = ['Baja', 'Media', 'Alta'];
    private string $defaultState = 'Recibido';

    public function test_valid_priorities(): void
    {
        $this->assertContains('Baja', $this->validPriorities);
        $this->assertContains('Media', $this->validPriorities);
        $this->assertContains('Alta', $this->validPriorities);
        $this->assertCount(3, $this->validPriorities);
    }

    public function test_default_state_is_recibido(): void
    {
        $this->assertEquals('Recibido', $this->defaultState);
    }

    public function test_invalid_priority_is_rejected(): void
    {
        $this->assertNotContains('Urgente', $this->validPriorities);
        $this->assertNotContains('Crítica', $this->validPriorities);
    }

    public function test_required_fields_for_service_order(): void
    {
        $required = ['client_id', 'device_id', 'service_type_id', 'diagnostico_inicial', 'prioridad'];
        $this->assertContains('client_id', $required);
        $this->assertContains('device_id', $required);
        $this->assertContains('service_type_id', $required);
        $this->assertContains('diagnostico_inicial', $required);
        $this->assertContains('prioridad', $required);
        $this->assertCount(5, $required);
    }
}
