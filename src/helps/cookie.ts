/**
 * @Title: cookie对象，用以读取或写入cookie。
 * @Author: Lizhigang
 * @Date: 2019-08-19
 * @Last Modified by: Lizhigang
 * @Last Modified time: 2019-08-19
 */

const cookie = {
  read(name: string): string | null {
    const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'))
    return match ? decodeURIComponent(match[3]) : null
  }
}

export default cookie
