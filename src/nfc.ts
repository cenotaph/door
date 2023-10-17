import pn532 from 'pn532'
import * as led from './leds'
import { SerialPort } from 'serialport'
import { pollButton } from './button'
import { checkTag, insertNewTag } from './database'

const usbFTDI = new SerialPort({ path: '/dev/ttyUSB0', baudRate: 115200 })
const serialPort = new SerialPort({ path: '/dev/ttyS0', baudRate: 115200 })
const rfid = new pn532.PN532(usbFTDI)
const rfid2 = new pn532.PN532(serialPort)

export const reinitialize = () => {
  const rfid1Count = rfid.listenerCount('tag')
  if (rfid1Count === 0) poll(rfid, 'USB')
  const rfid2Count = rfid2.listenerCount('tag')
  if (rfid2Count === 0) poll(rfid2, 'uart')
  console.log('re-initializing readers ...')
  console.log('for reinit, USB listener count is:')
  console.log(' --> ready: ', rfid.listenerCount('ready'))
  console.log(' --> tag: ', rfid.listenerCount('tag'))
  console.log('')
  led.reset()

  console.log()
}
export const stop = async () => {
  console.log('before stopping, USB listener count is:')
  console.log(' --> ready: ', rfid.listenerCount('ready'))
  console.log(' --> tag: ', rfid.listenerCount('tag'))
  await rfid.removeAllListeners('tag')
  await rfid2.removeAllListeners('tag')
  // rfid.frameEmitter.removeListener('tag', poll)

  console.log('stopped polling on both readers')
  console.log('after stopping, USB listener count is:')
  console.log(' --> ready: ', rfid.listenerCount('ready'))
  console.log(' --> tag: ', rfid.listenerCount('tag'))
}

export const readNewTag = async () => {
  const timeout = setTimeout(function () {
    console.log('No tag found')
    rfid.frameEmitter.removeAllListeners()
    rfid2.frameEmitter.removeAllListeners()
    reinitialize()
    pollButton()
  }, 10000)
  led.blink('blue', 8)
  console.log('Scanning for a new tag scan on USB FTDI interface...')
  const tag = await rfid.scanTag()
  clearTimeout(timeout)
  led.stopBlink()
  if (tag) {
    rfid.frameEmitter.removeAllListeners()
    rfid2.frameEmitter.removeAllListeners()
    const newTag = await insertNewTag(tag.uid)
    if (newTag.id) led.ledOn('green', 3000)
    else led.ledOn('red', 3000)
    console.log(' *** after scanning new tag for db,  USB listener count is:')
    console.log(' --> ready: ', rfid.listenerCount('ready'))
    console.log(' --> tag: ', rfid.listenerCount('tag'))
    console.log('   * * *  scanned new tag: ', tag.uid)
    console.log('')
    console.log('')
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
      if (allowAccess) led.ledOn('green', 3000)
      else led.ledOn('red', 3000)
    }
  })
}

export const start = async () => {
  rfid.on('ready', () => {
    poll(rfid, 'USB')
  })
  rfid2.on('ready', () => {
    poll(rfid2, 'uart')
  })
}
