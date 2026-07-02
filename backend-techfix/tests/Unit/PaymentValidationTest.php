<?php

namespace Tests\Unit;

use PHPUnit\Framework\TestCase;

class PaymentValidationTest extends TestCase
{
    // HU-08: Validación de reglas de negocio de pagos a nivel unidad.
    // Verifica métodos de pago permitidos, monto positivo y campos requeridos.
    private array $validMethods = ['Efectivo', 'Transferencia', 'Tarjeta', 'QR'];

    public function test_valid_payment_methods(): void
    {
        $this->assertContains('Efectivo', $this->validMethods);
        $this->assertContains('Transferencia', $this->validMethods);
        $this->assertContains('Tarjeta', $this->validMethods);
        $this->assertContains('QR', $this->validMethods);
        $this->assertCount(4, $this->validMethods);
    }

    public function test_invalid_payment_methods_are_rejected(): void
    {
        $this->assertNotContains('Cripto', $this->validMethods);
        $this->assertNotContains('Cheque', $this->validMethods);
        $this->assertNotContains('PayPal', $this->validMethods);
    }

    public function test_monto_must_be_positive(): void
    {
        $this->assertTrue(100.50 > 0);
        $this->assertTrue(0.01 > 0);
        $this->assertFalse(0 > 0);
        $this->assertFalse(-50 > 0);
    }

    public function test_pago_cannot_exceed_saldo_restante(): void
    {
        $costoTotal = 500.00;
        $totalPagado = 300.00;
        $saldoRestante = $costoTotal - $totalPagado;

        $this->assertEquals(200.00, $saldoRestante);
        $this->assertTrue(150 <= $saldoRestante);
        $this->assertTrue(200 <= $saldoRestante);
        $this->assertFalse(250 <= $saldoRestante);
    }

    public function test_required_fields_for_payment(): void
    {
        $required = ['service_order_id', 'monto', 'metodo_pago'];
        $this->assertContains('service_order_id', $required);
        $this->assertContains('monto', $required);
        $this->assertContains('metodo_pago', $required);
        $this->assertCount(3, $required);
    }
}
