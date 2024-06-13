// import { useEffect } from 'react';
// import axios from 'axios';

// axios.defaults.baseURL = 'http://localhost:5000';

// const useAxios = () => {
//   const FetchURL = ({
//     method = 'get',
//     url,
//     body = null,
//     data = null,
//     headers = { withCredentials: true },
//     func,
//   }) => {
//     useEffect(() => {
//       async function fetchData() {
//         const request = await axios[method](url, body || data, headers);
//         func(request.data.item || request.data.items || request.data.user);
//         return request;
//       }
//       fetchData();
//     }, [body, data, func, headers, method, url]);
//   };

//   return { FetchURL };
// };

// export default useAxios;

import { useCallback, useState } from 'react';
import axios from 'axios';

import URL from './url';

// hooks lấy dữ liệu từ API
const useFetch = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUrl = useCallback(async (requestConfig, applyData) => {
    setIsLoading(true);
    setError(null);
    try {
      const request = await axios({
        // `url` là server URL sẽ được sử dụng cho request.
        url: requestConfig.url,

        // `method` là phương thức request được dùng khi tạo ra request.
        method: requestConfig.method, // mặc định

        // `baseURL` sẽ được thêm đằng trước `url` trừ phi `url` là đường dẫn tuyệt đối.
        // Để cho tiện, có thể thiết đặt `baseURL` cho instance của axios
        // rồi truyền 'URL tương đối' vào vào phương thức của instance đó.
        baseURL: URL.BASE,

        // `transformRequest` cho phép thay đổi dữ liệu request trước khi nó được gửi tới server.
        // Chỉ có thể áp dụng được cho phương thức request 'PUT', 'POST', 'PATCH' và 'DELETE'.
        // Hàm cuối cùng trong mảng này phải trả về string hoặc trả về instance
        // của Buffer, ArrayBuffer, FormData hoặc Stream.
        // Bạn có thể chỉnh sửa đối tượng headers.
        // transformRequest: [
        //   function (data, headers) {
        //     // Làm bất cứ điều gì mình muốn để biến đổi dữ liệu.
        //     return data;
        //   },
        // ],
        transformRequest: requestConfig.transformRequest,

        // `transformResponse` cho phép thay đổi dữ liệu response trước khi
        // nó được truyền vào then/catch.
        // transformResponse: [
        //   function (data) {
        //     // Làm bất cứ điều gì mình muốn để biến đổi dữ liệu.
        //     return data;
        //   },
        // ],
        transformResponse: requestConfig.transformResponse,

        // `headers` là những header tự đặt để được gửi đi
        // headers: { 'X-Requested-With': 'XMLHttpRequest' },
        headers: requestConfig.headers,

        // `params` là các tham số URL để được gửi cùng với request.
        // Phải là đối tượng thông thường hoặc đối tượng URLSearchParams.
        // LƯU Ý: tham số mà là null hoặc undefined thì không được kết xuất ra URL.
        // params: {
        //   ID: 12345,
        // },
        params: requestConfig.params,

        // `paramsSerializer` là hàm tùy chọn để đảm nhiệm tuần tự hóa `params`.
        // (vd https://www.npmjs.com/package/qs, http://api.jquery.com/jquery.param/)
        // paramsSerializer: function (params) {
        //   return Qs.stringify(params, { arrayFormat: 'brackets' });
        // },
        paramsSerializer: requestConfig.paramsSerializer,

        // `data` là dữ liệu làm phần thân request để được gửi đi.
        // Chỉ áp dụng được cho phương thức request 'PUT', 'POST', 'DELETE', và 'PATCH'.
        // Khi `transformRequest` không được đặt thì `data` phải là một trong các kiểu sau đây:
        // - string, đối tượng thông thường, ArrayBuffer, ArrayBufferView, URLSearchParams;
        // - riêng cho Trình duyệt: FormData, File, Blob;
        // - riêng cho Node.js: Stream, Buffer.
        // data: {
        //   firstName: 'Lợi',
        // },
        // Bạn cũng có thể viết trực tiếp string vào `data`
        // theo định dạng `application/x-www-form-urlencoded`.
        // data: 'Country=Brasil&City=Belo Horizonte',
        data: requestConfig.data,

        // `timeout` để chỉ định số mili-giây trước khi request hết giờ.
        // Nếu thời gian request lâu hơn `timeout` thì request sẽ được ngưng giữa chừng.
        // timeout: 1000, // mặc định là `0` (không bao giờ hết giờ)
        timeout: requestConfig.timeout,

        // `withCredentials` biểu thị liệu việc tạo ra request cross-site `Access-Control`
        // thì có cần sử dụng credential hay không.
        // Xem thêm https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/withCredentials
        // và https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Credentials
        withCredentials: requestConfig.timeout || true, // mặc định 'false'

        // `adapter` cho phép tự đặt quá trình xử trí request, giúp cho việc kiểm thử dễ dàng hơn.
        // Trả về một promise trong đó cung cấp một response hợp lệ (xem lib/adapters/README.md).
        // adapter: function (config) {
        //   /* ... */
        // },
        adapter: requestConfig.adapter,

        // `auth` biểu thị rằng cần sử dụng ủy quyền HTTP Basic, trong đó có cung cấp credential.
        // Cái này sẽ thiết đặt header `Authorization`, ghi đè bất kì
        // header `Authorization` tự đặt nào trước đó mà bạn có thiết đặt thông qua `headers`.
        // Xin lưu ý rằng chỉ có ủy quyền HTTP Basic mới có thể cấu hình được thông qua tham số này.
        // Đối với Bearer token và tương tự, thì thay vào đó hãy tự đặt header `Authorization`.
        // auth: {
        //   username: 'janedoe',
        //   password: 's00pers3cret',
        // },
        auth: requestConfig.auth,

        // `responseType` biểu thị kiểu dữ liệu mà server sẽ hồi đáp, giá trị khả dĩ cho
        // tùy chọn này là: 'arraybuffer', 'document', 'json', 'text', 'stream'
        // riêng cho trình duyệt: 'blob'.
        // responseType: 'json', // mặc định
        responseType: requestConfig.responseType,

        // `responseEncoding` biểu thị biên mã dùng để giải mã response (riêng cho Node.js).
        // Lưu ý: sẽ bị bỏ qua nếu `responseType` là 'stream' hoặc request từ phía trình duyệt.
        // responseEncoding: 'utf8', // mặc định
        responseEncoding: requestConfig.responseEncoding,

        // `xsrfCookieName` là tên (key) của cái cookie dùng làm giá trị cho xsrf token.
        // xsrfCookieName: 'XSRF-TOKEN', // mặc định
        xsrfCookieName: requestConfig.xsrfCookieName,

        // `xsrfHeaderName` là tên (key) của cái http header mang giá trị xsrf token.
        // xsrfHeaderName: 'X-XSRF-TOKEN', // mặc định
        xsrfHeaderName: requestConfig.xsrfHeaderName,

        // `onUploadProgress` cho phép xử trí sự kiện tiến độ của việc tải lên.
        // Riêng cho trình duyệt.
        // onUploadProgress: function (progressEvent) {
        //   // Làm bất cứ điều gì mình muốn với sự kiện tiến độ native.
        // },
        onUploadProgress: requestConfig.onUploadProgress,

        // `onDownloadProgress` cho phép xử trí sự kiện tiến độ của việc tải xuống.
        // Riêng cho trình duyệt.
        // onDownloadProgress: function (progressEvent) {
        //   // Làm bất cứ điều gì mình muốn với sự kiện tiến độ native.
        // },
        onDownloadProgress: requestConfig.onDownloadProgress,

        // `maxContentLength` định nghĩa kích thước lớn nhất cho phép của nội dung http response
        // theo đơn vị byte. Riêng cho Node.js.
        // maxContentLength: 2000,
        maxContentLength: requestConfig.maxContentLength,

        // `maxBodyLength` định nghĩa kích thước lớn nhất cho phép của nội dụng http request
        // theo đơn vị byte. Riêng cho Node.js.
        // maxBodyLength: 2000,
        maxBodyLength: requestConfig.maxBodyLength,

        // `validateStatus` là hàm để quyết định rằng liệu với mã trạng thái HTTP response
        // đã cho thì phân giải hay từ chối promise.
        // Nếu `validateStatus` trả về `true` (hoặc hàm được đặt thành `null` hay `undefined`)
        // thì promise sẽ được phân giải; nếu không thì promise sẽ được từ chối.
        // validateStatus: function (status) {
        //   return status >= 200 && status < 300; // mặc định
        // },
        validateStatus: requestConfig.validateStatus,

        // `maxRedirects` định nghĩa số lần chuyển hướng tối đa để bám theo trong Node.js.
        // Nếu được đặt thành 0 thì sẽ không bám theo chuyển hướng nào cả.
        // maxRedirects: 5, // mặc định
        maxRedirects: requestConfig.maxRedirects,

        // `socketPath` định nghĩa UNIX Socket để được dùng trong node.js.
        // vd '/var/run/docker.sock' để gửi request tới docker daemon.
        // Chỉ có thể chỉ định một trong hai tùy chọn `socketPath` và `proxy`.
        // Nếu cả hai đều được chỉ định thì chỉ mỗi `socketPath` là được sử dụng.
        // socketPath: null, // mặc dịnh
        socketPath: requestConfig.socketPath,

        // `httpAgent` và `httpsAgent` định nghĩa tác thể tự đặt để được sử dụng khi thực hiện
        // request trên http và https tương ứng lần lượt, trong node.js. Điều này cho phép thêm
        // vào những tùy chọn như `keepAlive` vốn mặc định không được bật dùng.
        // httpAgent: new http.Agent({ keepAlive: true }),
        // httpsAgent: new https.Agent({ keepAlive: true }),
        httpAgent: requestConfig.httpAgent,
        httpsAgent: requestConfig.httpsAgent,

        // `proxy` định nghĩa tên host, cổng, và giao thức của proxy server.
        // Bạn cũng có thể định nghĩa proxy của mình bằng cách dùng biến môi trường
        // quy ước `http_proxy` với `https_proxy`. Nếu bạn đang sử dụng biến môi trường
        // cho cấu hình proxy của mình, bạn cũng có thể định nghĩa một biến môi trường
        // `no_proxy` với nội dung là danh sách các tên miền phân cách bằng dấu phẩy mà
        // không cần được proxy.
        // Dùng `false` để tắt dùng proxy, bỏ qua biến môi trường.
        // `auth` biểu thị rằng cần dùng ủy quyền HTTP Basic để kết nối đến proxy, trong đó
        // có cung cấp crendential.
        // Điều này sẽ thiết đặt header `Proxy-Authorization`, ghi đè bất kì
        // header `Authorization` tự đặt nào trước đó mà bạn có thiết đặt thông qua `headers`.
        // Nếu proxy server sử dụng HTTPS thì bạn phải đặt giao thức thành `https`.
        // proxy: {
        //   protocol: 'https',
        //   host: '127.0.0.1',
        //   port: 9000,
        //   auth: {
        //     username: 'mikeymike',
        //     password: 'rapunz3l',
        //   },
        // },
        proxy: requestConfig.proxy,

        // `cancelToken` chỉ định token bãi bỏ có thể được dùng để bãi bỏ request.
        // (xem mục Bãi bỏ Request bên dưới để biết thêm chi tiết)
        // cancelToken: new CancelToken(function (cancel) {}),
        cancelToken: requestConfig.cancelToken,

        // `decompress` biểu thị rằng liệu phần thân response có nên được giải nén tự động
        // hay không. Nếu thiết đặt thành `true` thì cũng sẽ gỡ header `content-encoding`
        // ra khỏi các đối tượng response của tất cả các response được giải nén.
        // - Riêng cho Node.js (vì XHR không thể tắt giải nén được)
        // decompress: true, // mặc định
        decompress: requestConfig.decompress,
      });

      applyData(request.data);
    } catch (err) {
      setError(err.message || 'Something went wrong!');
    }
    setIsLoading(false);
  }, []);

  return {
    isLoading,
    error,
    fetchUrl,
  };
};

export default useFetch;
