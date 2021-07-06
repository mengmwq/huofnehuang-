/**
 * 文章
 * Created by sunzelong on 2019/01/07.
 */
export class Article {
  constructor() {
    this.id = null; //                      编号
    this.typeId = null; //         类型(首页轮播carousel、朗文longman、美文essay、学习)
    this.typeName = null; //         类型名称(首页轮播、朗文、美文、学习)
    this.articleTitle = null; //         标题
    this.articleAuthor = null; //    作者
    this.articleIntroduce = null; //介绍
    this.articleUrl  = null; //          外链
    this.articleImage  = null; //    封面图片
    this.articleContent  = null; //  内容(包含图文、视频、音频)
    this.articleSort   = null; //       排序
    this.articleState  = null; //      状态(正常common、删除delete)
    this.createTime  = null; //       创建时间
  }
}
