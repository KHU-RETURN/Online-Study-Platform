# Front test

프로토타입 <-> folder

- 그룹 페이지 <-> check_group
- 그룹 초대 받기 <-> accept_invitation
- 그룹 생성 <-> make_group
- 그룹 수정 <-> edit_group

### Getting Started

- json-server 설치 (프론트만 테스트할 때 생략 가능) https://www.npmjs.com/package/json-server

```commandline
npm install -g json-server
```

- json-server 연결 (프론트만 테스트할 때 생략 가능)

```commandline
cd json-server
json-server --watch db.json --port 5000
```

- node 실행

```commandline
node app.js
```

- http://localhost:3000 접속
- http://localhost:3000/check_group?code=5

(node port 3000, json-server port 5000)

### 구현사항

- 그룹 생성
  - 그룹 이름 / 그룹 설명 / 그룹 생상 입력 -> 서버에 전달
  - 빠진 input값 있는지 확인
    (ex. 그룹 이름 입력 x -> 그룹 이름을 입력하세요. 창)
- 그룹 수정
  - 선택한 그룹의 기존 정보 불러오기
  - 수정한 뒤에 수정하기 버튼 누르면 서버에 전달
  - 빠진 input값 있는지 확인
    (ex. 그룹 이름 입력 x -> 그룹 이름을 입력하세요. 창)
  - 삭제하기 버튼 누르면 서버에서 삭제
  - 삭제 시 삭제를 다시 확인하는 창 띄우기
- 초대 코드 입력
  - 초대 코드 입력 > 참여하기 버튼 클릭 > 그룹 페이지로 code 값 전달
  - 빠진 input값 있는지 확인
- 그룹 페이지
  - 선택한 그룹의 code(id)와 일치하는 그룹의 정보 불러오기
  - 그룹 색상으로 아이콘, 선택바 색 표시
  - 그룹 색상이 연한 색일 때는 검정색, 진한 색일 때는 흰색으로 font color 지정

### 추가할 것

- 페이지 이동 구현 관련
  - location.href 를 사용해서?
