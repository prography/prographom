# web
Web Team이 스터디 목적으로 개발하는 Prography 페이지입니다.


#### 개발에 참여하기

Github 관리
- 이 프로젝트는 Github을 사용해 버전 관리를 합니다. 필요할 경우, 개인의 이름으로 된 브랜치로 개발을 하고, 마스터에 머지형태로 관리합니다.
- Github에서 pulling 하는 형태는 다음과 같습니다.
```
$ git clone https://github.com/prography/web.git
```


Localhost 에서 확인
- node 기반으로 이루어진 페이지를 띄우고 확인하는 과정입니다.

```shell
$ node server.js
Express server has started on port 3000
```

AWS 상에서 확인
- putty 등을 통해 13.125.217.76 서버에 접속합니다
- 마지막 개발의 편의를 위해 nodemon package를 활용합니다
```shell
$ sudo nodemon server
Express server has started on port 80
```

웹페이지에서 `localhost:3000`으로 들어갔을 때 Prography의 홈이 뜨면 성공!
