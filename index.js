const http = require('http')
const https = require('https')
const fs = require('fs')
const path = require('path')
const parseInt = require('parse-int')

if(process.argv.length < 3)
{
  console.log('명령인수가 최소 1개 (url)는 필요합니다.')
  process.exit(0)
}
// 프로토콜 판단
var protocol = process.argv[2].split(':')[0] == "http" ? http : https
// 확장자
var extension = process.argv[2].split('.')[process.argv[2].split('.').length - 1]
// 파일명 자릿수
var padVal = process.argv[2].match(/[\d]+\./).toString().length - 1
// 시작 파일명 중 시작 숫자를 찾기
var firstIdx = parseInt(process.argv[2].match(/[\d]+\./).toString().substr(0, process.argv[2].match(/[\d]+\./).toString().length - 1))
// 이미지 증가 숫자를 제외한 나머지 url
var url = process.argv[2].substr(0, process.argv[2].length - extension.length - 1 - padVal)
// 한번에 받을 이미지 개수 (기본값 5)
var threadCnt = process.argv[3] === undefined ? 5 : parseInt(process.argv[3])
var idxTerm = 50
// 기본적으로 상위 경로를 폴더명 으로
var foldername = process.argv[4] === undefined ? process.argv[2].split('/')[process.argv[2].split('/').length - 2] : process.argv[4]

// 동일한 폴더명 존재시 _00 으로 신규 폴더 생성
while(fs.existsSync(foldername)) {
  if(parseInt(foldername.substr(foldername.length-2, 2)) !== undefined)
    foldername = foldername.split('_')[0] + '_' + (parseInt(foldername.substr(foldername.length-2, 2)) + 1)
  else
    foldername = foldername + '_00'
}
fs.mkdirSync(path.resolve(__dirname, foldername));
console.log(`download from : ${url} \nsaved folder : ${foldername}`)


for(i = 0; i < threadCnt ; i++) {
  download(firstIdx + (i * idxTerm), firstIdx + ((i + 1) * idxTerm))
}
function download(idx, lastIdx) {
  if(idx == lastIdx)
    return;
  var imgUrl = `${url}${pad(idx,padVal)}.${extension}`
  protocol.get(imgUrl, (res) => {
    if(res.statusCode != 200) {
      console.log('Cannot found anymore!')
      threadCnt--
      if(threadCnt == 0)
        process.exit(0)
      return;
    }
    else {
      console.log(imgUrl)
      var file = fs.createWriteStream(path.resolve(__dirname, foldername, `${pad(idx,padVal)}.${extension}`))
      res.pipe(file)
      download(idx + 1, lastIdx)
    }
  })
}
function pad(n, width) {
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
}
