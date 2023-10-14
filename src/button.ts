import rpio from 'rpio'
const config = require('./config.json')
import * as nfc from './nfc'

rpio.open(config.button, rpio.INPUT, rpio.PULL_UP)

const pollcb = async (pin: number) => {
  rpio.msleep(20)

  if (rpio.read(pin)) return

  console.log('Button pressed on pin P%d', pin)
  rpio.poll(pin, null)
  nfc.stop()

  const newTag = await nfc.readNewTag()

  //  registerNewTag(newTag.uid)
  nfc.reinitialize()
  if (!newTag) rpio.poll(config.button, pollcb, rpio.POLL_LOW)
}

export const pollButton = () => {
  rpio.poll(config.button, pollcb, rpio.POLL_LOW)
}
