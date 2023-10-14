import * as led from './leds'
import * as nfc from './nfc'
import rpio from 'rpio'
import { pollButton } from './button'

const config = require('./config.json')

led.reset()
led.status()

nfc.start()
pollButton()
