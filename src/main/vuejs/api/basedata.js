import { httpClient } from './base.js'

/**
 * 城市数据
 */
export const city = () => {
  return httpClient.get(`address.json`).then(ret => {
    return convert(ret.data)
  })
}

function convert (data) {
  if (data && data.length > 0) {
    let result = []
    data.forEach(item => {
      result.push({
        value: item.cityCode.cityName,
        label: item.cityCode.cityName,
        children: convert(item.detailList)
      })
    })
    return result
  } else {
    return null
  }
}
