import Component from "./Component.js";

export default class Items extends Component {
    setup () {
        this.state = { items: [] };
        this.callApi(function(result){
            this.state.items = result;
            this.listRender();
            this.infoRender(0);
        });
    }

    callApi (callback) {
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
            listRender(setData.items);
            // 예약 아이템을 클릭하면 예약 상세 (예약 및 고객 정보)에 관련 데이터를 표출한다.
            // 초기 예약 상세는 첫 번째 예약 아이템을 표출
            // status가 done인것은 제외
            infoRender(setData.items, 0);
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

                    callback(initData(result.reservations));
                } catch (e) {
                    return {
                        isError: true,
                        data: e.message,
                    };
                }
            },
        };
    }
}