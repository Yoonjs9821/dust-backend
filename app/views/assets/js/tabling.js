// init data
let setData = {
    items: []
}
const initData = (array) => {
    array.forEach((data) => {
        // 시간은 HH:mm 형식으로 표출 해주세요
        let timeReservedText = new Date(data.timeReserved).getHours() 
                    + ':' + (new Date(data.timeReserved).getMinutes()<10?'0':'')
                    + new Date(data.timeReserved).getMinutes();
        data.timeReservedText = timeReservedText;

        // reserved는 “예약", seated는 “착석 중”, button class 구분
        let statusText,buttonText,buttonClass = "";
        switch (data.status) {
            case 'reserved':
                statusText = "예약";
                buttonText = "착석";
                buttonClass = "in"
                break;
            case 'seated':
                statusText = "착석 중";
                buttonText = "퇴석";
                buttonClass = "out";
                break;
        }
        data.statusText = statusText;
        data.buttonText = buttonText;
        data.buttonClass = buttonClass;

        // status가 done 이면 미표출
        if(!(data.status == "done")){
            setData.items.push(data);
        }
    });
    console.log(array);
    console.log(setData.items);

    // Rendering
    ListRender(setData.items);
    // 예약 아이템을 클릭하면 예약 상세 (예약 및 고객 정보)에 관련 데이터를 표출한다.
    // 초기 예약 상세는 첫 번째 예약 아이템을 표출
    // status가 done인것은 제외
    InfoRender(setData.items, 0);
}

// frontend.tabling.co.kr Call API
const request = async (url) => {
    try {
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            const errorData = await response.json();
            throw errorData;
        }
    } catch (e) {
        throw {
            message: e.message,
            status: e.status,
        };
    }
};
const api = {
    reservations: async () => {
        try {
            const result = await request(
                "https://frontend.tabling.co.kr/v1/store/9533/reservations"
            );
            initData(result.reservations);

        } catch (e) {
            console.log(e.message);
            return {
                isError: true,
                data: e,
            };
        }
    },
};
api.reservations();

// reservationList Component Rendering
const $reservationList = document.querySelector('.reservationList');

const ListRender = (array) => {
    let html = '';
    array.forEach(({customer, id, menus, status, tables, statusText, timeReservedText, buttonClass, buttonText}) => {
        // List item
        let item = "";

        // status가 done 이면 미표출
        if(!(status == "done")){
            item = `
                <li id="${id}" class="targetReservation">
                    <div>
                        <p>${timeReservedText} <br/> ${statusText}</p>
                    </div>
                    <div>
                        <p>${customer.name} - 테이블명 [${tables.map(table => `${table.name}`)}]</p>
                        <p>성인 <span>${customer.adult}</span> 아이 <span>${customer.child}</span></p>
                        <p>메뉴명(갯수) [${menus.map(menu => `${menu.name} (${menu.qty})`)}]</p>
                    </div>
                    <button class="${buttonClass} btn">${buttonText}</button>
                </li>
            `;
        }
        
        html += item;
    });

    $reservationList.innerHTML = html;

    // Button Evnet
    const buttons = document.querySelectorAll('button');
    buttons.forEach(function(button){
        button.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn')){
                // [착석] 버튼을 클릭하면, [퇴석]으로 버튼을 변경한다.
                // [퇴석] 버튼을 클릭하면, 예약 목록에서 제거한다.
                if(e.target.classList.contains('in')){
                    e.target.className = 'out btn';
                    e.target.innerText = '퇴석';
                } else if(e.target.classList.contains('out')){
                    setData.items = setData.items.filter(({id}) => id != button.parentNode.id);
                    ListRender(setData.items);
                    InfoRender(setData.items, 0);
                }
            }
        })
    })

    const targets = document.querySelectorAll('.targetReservation');
    targets.forEach(function(target, index){        
        target.addEventListener('click', (e) => {
            if (!e.target.classList.contains('btn')){
                // Desktop, Mobile 구분
                if (matchMedia("screen and (min-width: 1024px)").matches) {
                    // 1024px 이상 Desktop
                    InfoRender(setData.items, index);
                } else {
                    // 1024px 미만 Mobile
                    modalRender(setData.items, index);
                }
            }
        })
    })
}

// reservationInfo Component Rendering
const $reservationInfo = document.querySelector('.reservationInfo');

const InfoRender = (data, index) => {
    if(data.length < 1) {
        $reservationInfo.innerHTML = ""; 
        $reservationInfo.style.display = 'none';
        return;
    }

    let html = `
            <h3>예약 정보</h3>
            <dl>
                <dt>예약 상태</dt>
                <dd>${data[index].statusText}</dd>
            </dl>
            <dl>
                <dt>예약 시간</dt>
                <dd>${data[index].timeReserved}</dd>
            </dl>
            <dl>
                <dt>접수 시간</dt>
                <dd>${data[index].timeRegistered}</dd>
            </dl>

            <h3>고객 정보</h3>
            <dl>
                <dt>고객 성명</dt>
                <dd>${data[index].customer.name}</dd>
            </dl>
            <dl>
                <dt>고객 등급</dt>
                <dd>${data[index].customer.level}</dd>
            </dl>
            <dl>
                <dt>고객 메모</dt>
                <dd>${data[index].customer.memo}</dd>
            </dl>
            <dl>
                <dt>요청사항</dt>
                <dd>${data[index].customer.request}</dd>
            </dl>
    `;

    $reservationInfo.innerHTML = html;
}

//modal
const $modal = document.querySelector('.modal');
const $modalBackdrop = document.querySelector('.modalBackdrop');

const modalRender= (data, index) => {
    if(data.length < 1) {$modal.innerHTML = ""; return;}

    let html = `
            <div>
                <h3>예약 정보</h3><button class="modalClose">닫기</button>
            </div>
            <dl>
                <dt>예약 상태</dt>
                <dd>${data[index].statusText}</dd>
            </dl>
            <dl>
                <dt>예약 시간</dt>
                <dd>${data[index].timeReserved}</dd>
            </dl>
            <dl>
                <dt>접수 시간</dt>
                <dd>${data[index].timeRegistered}</dd>
            </dl>

            <h3>고객 정보</h3>
            <dl>
                <dt>고객 성명</dt>
                <dd>${data[index].customer.name}</dd>
            </dl>
            <dl>
                <dt>고객 등급</dt>
                <dd>${data[index].customer.level}</dd>
            </dl>
            <dl>
                <dt>고객 메모</dt>
                <dd>${data[index].customer.memo}</dd>
            </dl>
            <dl>
                <dt>요청사항</dt>
                <dd>${data[index].customer.request}</dd>
            </dl>
    `;
    
    $modal.innerHTML = html;

    $modal.classList.add("active");
    $modalBackdrop.classList.add("active");

    $modalBackdrop.addEventListener('click', (e) => {
        $modal.classList.remove("active");
        $modalBackdrop.classList.remove("active");
    })

    document.querySelector('.modalClose').addEventListener('click', (e) => {
        $modal.classList.remove("active");
        $modalBackdrop.classList.remove("active");
    })
}
    