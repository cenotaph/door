import pn532 from 'pn532'
import * as led from './leds'
import { SerialPort } from 'serialport'
import { pollButton } from './button'
import { checkTag, insertNewTag, logEntry } from './database'
import { doorOpen } from './relay'

//const usbFTDI = new SerialPort({ path: '/dev/ttyUSB0', baudRate: 115200 })
const serialPort = new SerialPort({ path: '/dev/ttyS0', baudRate: 115200 })
//const rfid = new pn532.PN532(usbFTDI)
const rfid2 = new pn532.PN532(serialPort)

export const reinitialize = () => {
//  const rfid1Count = rfid.listenerCount('tag')
//  if (rfid1Count === 0) poll(rfid, 'USB')
  const rfid2Count = rfid2.listenerCount('tag')
  if (rfid2Count === 0) poll(rfid2, 'uart')

  led.reset()

  console.log()
}
export const stop = async () => {
//  await rfid.removeAllListeners('tag')
  await rfid2.removeAllListeners('tag')
}

export const readNewTag = async () => {
  const timeout = setTimeout(function () {
    console.log('No tag found')
//    rfid.frameEmitter.removeAllListeners()
    rfid2.frameEmitter.removeAllListeners()
    reinitialize()
    pollButton()
  }, 10000)
  led.blink('blue', 8)
  console.log('Scanning for a new tag scan on UARTI interface...')
  const tag = await rfid2.scanTag()
  clearTimeout(timeout)
  led.stopBlink()
  if (tag) {
//    rfid.frameEmitter.removeAllListeners()
    rfid2.frameEmitter.removeAllListeners()
    const newTag = await insertNewTag(tag.uid)

    if (newTag.rowCount === 1) led.ledOn('green', 3000)
    else led.ledOn('red', 3000)
    return tag
  }
}

export const poll = async (device: pn532, name: string) => {
  device.frameEmitter.removeAllListeners()
  console.log(`Listening for a tag scan on ${name} interface...`)
  device.on('tag', async (tag) => {
    if (tag) {
      console.log(`checking tag ${tag.uid} read on ${name} NFC reader:`)
      const allowAccess = await checkTag(tag.uid)
      if (allowAccess && allowAccess.active) {
        led.ledOn('green', 3000)
        doorOpen(4000)
	console.log(allowAccess)
        await logEntry(allowAccess.id)
      } else led.ledOn('red', 3000)
    }
  })
}

export const start = async () => {
//  rfid.on('ready', () => {
//    poll(rfid, 'USB')
//  })
  rfid2.on('ready', () => {
    poll(rfid2, 'uart')
  })
}
