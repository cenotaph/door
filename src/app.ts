import * as led from './leds'

led.reset()
led.status()

led.blink('red', 3)
led.blink('green', 7)
led.blink('blue', 5)
led.reset()
