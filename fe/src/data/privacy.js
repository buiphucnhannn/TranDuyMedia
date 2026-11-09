import { siteConfig } from "@/config/site";

const { contact } = siteConfig;

/**
 * Chính sách bảo mật & bảo vệ dữ liệu cá nhân — hiển thị ở /chinh-sach-bao-mat, liên kết từ ô "Tôi đồng ý…"
 * của mọi form thu thập thông tin khách hàng (form đặt lịch tư vấn).
 *
 * Căn cứ: Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15 (hiệu lực 01/01/2026) và văn bản hướng dẫn thi hành.
 *
 * SỬA NỘI DUNG → đổi `version` + `updated` ở đây VÀ PRIVACY_VERSION ở be/src/models/booking.model.js
 * (mỗi yêu cầu đặt lịch lưu phiên bản chính sách khách đã đồng ý, làm bằng chứng khi cần).
 */
export const PRIVACY_POLICY = {
  version: "2026-11-09",
  updated: "09/11/2026",
  path: "/chinh-sach-bao-mat",
  // Tên pháp lý + mã số thuế / ĐKKD của đơn vị (hiện trên trang). null → chỉ hiện tên thương hiệu.
  legalName: null, // TODO: điền tên hộ kinh doanh / công ty theo giấy phép
  taxId: null, // TODO: điền mã số thuế / mã số đăng ký kinh doanh
};

/** Các mục của chính sách. body: đoạn văn (string) hoặc danh sách ({ list: [...] }). */
export const privacySections = [
  {
    id: "don-vi-xu-ly",
    title: "Đơn vị thu thập và xử lý dữ liệu",
    body: [
      `${siteConfig.name} (“chúng tôi”) là bên kiểm soát và xử lý dữ liệu cá nhân bạn cung cấp qua website ${siteConfig.url.replace(/^https?:\/\//, "")}.`,
      {
        list: [
          `Địa chỉ: ${contact.address}, ${contact.city}.`,
          `Điện thoại / Zalo: ${contact.phone}.`,
          `Email: ${contact.email}.`,
        ],
      },
    ],
  },
  {
    id: "du-lieu-thu-thap",
    title: "Dữ liệu cá nhân chúng tôi thu thập",
    body: [
      "Khi bạn gửi form đặt lịch tư vấn, chúng tôi chỉ thu thập những thông tin cần thiết để liên hệ và tư vấn:",
      {
        list: [
          "Họ và tên, số điện thoại / Zalo (bắt buộc).",
          "Dịch vụ quan tâm, ngày mong muốn, ngân sách dự kiến và nội dung mô tả yêu cầu (không bắt buộc).",
          "Thông tin kỹ thuật khi gửi form: thời điểm gửi, thời điểm bạn đồng ý với chính sách này, địa chỉ IP và loại trình duyệt — dùng để chứng minh sự đồng ý và chống gửi tin rác.",
        ],
      },
      "Chúng tôi không thu thập dữ liệu cá nhân nhạy cảm. Vui lòng không ghi thông tin nhạy cảm (sức khoẻ, tài chính, số giấy tờ tuỳ thân…) vào ô mô tả.",
    ],
  },
  {
    id: "muc-dich",
    title: "Mục đích xử lý dữ liệu",
    body: [
      {
        list: [
          "Liên hệ tư vấn, báo giá và sắp xếp lịch sản xuất video, chụp ảnh hoặc thuê studio theo yêu cầu của bạn.",
          "Chăm sóc khách hàng liên quan trực tiếp đến yêu cầu bạn đã gửi.",
          "Bảo đảm an toàn hệ thống, phát hiện và ngăn chặn gửi tin rác, lạm dụng.",
        ],
      },
      "Chúng tôi không dùng dữ liệu của bạn để gửi quảng cáo, tiếp thị khi chưa có sự đồng ý riêng của bạn, và không xử lý cho mục đích khác ngoài các mục đích nêu trên.",
    ],
  },
  {
    id: "co-so-phap-ly",
    title: "Sự đồng ý của bạn",
    body: [
      "Chúng tôi chỉ xử lý dữ liệu khi bạn chủ động tích vào ô “Tôi đồng ý…” trước khi gửi form. Ô này không được chọn sẵn; nếu không đồng ý, bạn vẫn có thể liên hệ trực tiếp qua điện thoại hoặc Zalo.",
      "Bạn có thể rút lại sự đồng ý bất kỳ lúc nào (xem mục “Cách thực hiện quyền”). Việc rút lại không ảnh hưởng đến tính hợp pháp của việc xử lý đã thực hiện trước đó.",
    ],
  },
  {
    id: "thoi-gian-luu-tru",
    title: "Thời gian lưu trữ",
    body: [
      "Dữ liệu được lưu trong thời gian cần thiết để tư vấn và thực hiện dịch vụ, tối đa 24 tháng kể từ lần liên hệ gần nhất, hoặc đến khi bạn yêu cầu xoá / rút lại sự đồng ý — tuỳ thời điểm nào đến trước, trừ trường hợp pháp luật yêu cầu lưu lâu hơn. Hết thời hạn, dữ liệu được xoá hoặc ẩn danh.",
    ],
  },
  {
    id: "chia-se",
    title: "Chia sẻ dữ liệu",
    body: [
      "Chúng tôi không bán, cho thuê hay trao đổi dữ liệu cá nhân của bạn. Dữ liệu chỉ được tiếp cận bởi:",
      {
        list: [
          "Nhân sự của chúng tôi trực tiếp phụ trách tư vấn yêu cầu của bạn.",
          "Nhà cung cấp hạ tầng kỹ thuật (máy chủ, cơ sở dữ liệu đám mây) xử lý thay mặt chúng tôi, chỉ trong phạm vi vận hành website và có cam kết bảo mật.",
          "Cơ quan nhà nước có thẩm quyền khi pháp luật yêu cầu.",
        ],
      },
      "Một số nhà cung cấp hạ tầng đám mây có thể đặt máy chủ ngoài lãnh thổ Việt Nam. Trong trường hợp đó, việc chuyển dữ liệu được thực hiện theo đúng quy định của pháp luật Việt Nam về chuyển dữ liệu cá nhân ra nước ngoài.",
    ],
  },
  {
    id: "bao-mat",
    title: "Biện pháp bảo vệ dữ liệu",
    body: [
      {
        list: [
          "Toàn bộ dữ liệu truyền qua website được mã hoá bằng giao thức HTTPS.",
          "Chỉ quản trị viên đã đăng nhập mới xem được yêu cầu đặt lịch; mật khẩu được mã hoá một chiều, phiên đăng nhập tự hết hạn.",
          "Giới hạn số lần gửi form và đăng nhập để chống truy cập trái phép.",
        ],
      },
      "Nếu xảy ra sự cố vi phạm dữ liệu cá nhân, chúng tôi sẽ thông báo cho cơ quan chức năng và cho bạn theo thời hạn pháp luật quy định.",
    ],
  },
  {
    id: "quyen-cua-ban",
    title: "Quyền của bạn",
    body: [
      "Theo pháp luật về bảo vệ dữ liệu cá nhân, bạn có quyền:",
      {
        list: [
          "Được biết về hoạt động xử lý dữ liệu cá nhân của mình.",
          "Đồng ý hoặc không đồng ý, rút lại sự đồng ý cho việc xử lý dữ liệu.",
          "Xem, chỉnh sửa hoặc yêu cầu chỉnh sửa dữ liệu của mình.",
          "Yêu cầu xoá dữ liệu, hạn chế xử lý dữ liệu.",
          "Yêu cầu cung cấp dữ liệu cá nhân của mình.",
          "Phản đối việc xử lý dữ liệu.",
          "Khiếu nại, tố cáo, khởi kiện và yêu cầu bồi thường thiệt hại theo quy định của pháp luật.",
        ],
      },
    ],
  },
  {
    id: "cach-thuc-hien-quyen",
    title: "Cách thực hiện quyền",
    body: [
      `Gửi yêu cầu qua email ${contact.email} hoặc gọi / nhắn Zalo ${contact.phone}, kèm họ tên và số điện thoại đã dùng khi gửi form để chúng tôi xác minh. Chúng tôi xác nhận đã nhận yêu cầu trong vòng 72 giờ và xử lý trong thời hạn pháp luật quy định.`,
    ],
  },
  {
    id: "cookie",
    title: "Cookie và nội dung nhúng",
    body: [
      "Website không dùng cookie quảng cáo hay công cụ theo dõi hành vi. Chúng tôi chỉ dùng cookie cần thiết cho chức năng đăng nhập trang quản trị và bộ nhớ trình duyệt để ghi nhớ một số tuỳ chọn hiển thị.",
      "Bản đồ Google Maps và video YouTube / Google Drive nhúng trên website do bên thứ ba cung cấp và có thể đặt cookie theo chính sách riêng của họ khi bạn xem hoặc phát nội dung.",
    ],
  },
  {
    id: "tre-em",
    title: "Trẻ em",
    body: [
      "Dịch vụ của chúng tôi hướng tới doanh nghiệp và người trưởng thành. Nếu bạn chưa đủ 16 tuổi, vui lòng chỉ gửi thông tin khi đã có sự đồng ý của cha mẹ hoặc người giám hộ.",
    ],
  },
  {
    id: "thay-doi",
    title: "Thay đổi chính sách",
    body: [
      "Chúng tôi có thể cập nhật chính sách này khi pháp luật hoặc hoạt động xử lý dữ liệu thay đổi. Phiên bản mới có hiệu lực kể từ ngày cập nhật ghi ở đầu trang; các thay đổi quan trọng sẽ được thông báo trên website.",
    ],
  },
];
