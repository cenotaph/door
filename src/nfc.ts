import pn532 from 'pn532'
import * as led from './leds'
import { SerialPort } from 'serialport'
import { pollButton } from './button'

const usbFTDI = new SerialPort({ path: '/dev/ttyUSB0', baudRate: 115200 })
const serialPort = new SerialPort({ path: '/dev/ttyS0', baudRate: 115200 })
const rfid = new pn532.PN532(usbFTDI)
const rfid2 = new pn532.PN532(serialPort)

export const reinitialize = () => {
  console.log('re-initializing readers ...')
  console.log('')
  // rfid.emit('ready')
  // rfid2.emit('ready')
}
export const stop = () => {
  // rfid.frameEmitter.removeAllListeners()
  // rfid2.frameEmitter.removeAllListeners()
  // rfid.frameEmitter.removeListener('tag', poll)
  console.log('stopped polling on both readers')
}

export const readNewTag = async () => {
  const timeout = setTimeout(function () {
    console.log('No tag found')
    // rfid.frameEmitter.removeAllListeners()
    // rfid2.frameEmitter.removeAllListeners()
    reinitialize()
    pollButton()
  }, 10000)
  led.blink('green', 8)
  console.log('Scanning for a new tag scan on USB FTDI interface...')
  const tag = await rfid.scanTag()
  clearTimeout(timeout)
  led.stopBlink()
  if (tag) {
    console.log('tag:', tag.uid)
    return tag
  }
}

export const poll = (device: pn532, name: string) => {
  console.log(`Listening for a tag scan on ${name} interface...`)
  device.on('tag', function (tag) {
    if (tag) {
      console.log(`tag on ${name} NFC reader: `, tag.uid)
    }
  })
}

export const start = () => {
  rfid.on('ready', () => {
    poll(rfid, 'USB')
  })
  rfid2.on('ready', () => {
    poll(rfid2, 'uart')
  })
}
