import pn532 from 'pn532'
import { SerialPort } from 'serialport'

const usbFTDI = new SerialPort({ path: '/dev/ttyUSB0', baudRate: 115200 })
const serialPort = new SerialPort({ path: '/dev/ttyS0', baudRate: 115200 })
const rfid = new pn532.PN532(usbFTDI)
const rfid2 = new pn532.PN532(serialPort)

export const poll = () => {
  rfid.on('ready', function () {
    console.log('Listening for a tag scan on USB FTDI interface...')
    rfid.on('tag', function (tag) {
      if (tag) console.log('tag on USB FTDI NFC reader:', tag.uid)
    })
  })
  rfid2.on('ready', function () {
    console.log('Listening for a tag scan on UART interface...')
    rfid2.on('tag', function (tag) {
      if (tag) console.log('tag on UART NFC reader:', tag.uid)
    })
  })
}
