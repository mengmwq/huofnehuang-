/**
 * Created by along on 2017/10/11.
 */
export class LtHeader {
  constructor() {
    this.id = null;
    this.userId = null;// 用户id
    this.pageDistiction = null;// 页面区分
    this.flag = null;// 标记:0--查询结果为空   1--查询有结果
    this.headerColumn = null;//  表头信息
  }
}
