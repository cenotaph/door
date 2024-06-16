import 'dotenv/config'
import * as led from './leds'
import * as nfc from './nfc'
import rpio from 'rpio'
import { pollButton } from './button'
import * as relay from './relay'

relay.reset()
relay.status()
led.reset()
led.status()

nfc.start()
pollButton()
