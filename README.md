# imageDownloader
## 연속된 숫자로 된 파일명을 가진 웹사이트 이미지를 다운로드 받는 프로그램

* url주소는 반드시 아래와 같이 연속된 숫자로 되어 있어야 함. (앞에 0이 포함된)
* 확장자가 없으면 오류 발생함
* http://hostaddress.com/xxxx0001.jpg (ok)
* http://hostaddress.com/xxxx0002.jpg (ok)
* http://hostaddress.com/image/0001.jpg (ok)
* http://hostaddress.com/image/0002.jpg (ok)
* http://hostaddress.com/image/0001 (Failed)

```
node index.js "Url address"
```

* 기본적으로 파일 다운로드는 001, 050, 100, 150, 200 다섯개의 파일을 동시에 시작한다.
* 두번째 파라미터로 숫자를 입력하면 동시 다운로드 수행하는 개수를 지정 할 수 있다.
```
node index.js "Url address" 7
```
* 위와 같이 실행할 경우 001, 050, 100, 150, 200, 250, 300으로 총 7개의 쓰레드가 동시에 동작한다.