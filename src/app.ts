import * as led from './leds'
import * as nfc from './nfc'

led.reset()
led.status()

// led.blink('red', 3)
// led.blink('green', 7)
// led.blink('blue', 5)
// led.reset()

nfc.poll()
