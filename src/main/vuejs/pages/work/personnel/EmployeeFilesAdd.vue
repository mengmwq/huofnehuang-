<template>
  <div>
    <el-form
      label-position="right"
      :model="form"
      ref="form"
      label-width="190px"
    >
      <!-- 打印内容开始 -->
      <div class="print-data">
        <div class="title">
          申请信息
          <div class="line"></div>
        </div>
        <!-- 基础信息 -->
        <p class="step-title"><span class="step-icon">1</span>基本信息：</p>
        <div class="dash-content">
          <el-row>
            <el-col :span="8">
              <el-form-item label="姓名：">
                {{ form.name }}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="员工编号：">
                {{ form.personNum }}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="身份证号：">
                {{ form.name }}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="电话：">
                {{ form.name }}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="出生日期：">
                {{ form.personNum }}
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item label="性别：">
                {{ form.personNum }}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="籍贯：" prop="areaAddress">
                <el-cascader
                  placeholder="省市区"
                  style="width: 100%;"
                  :options="options"
                  :props="defaultProps"
                  v-model="form.areaAddress"
                >
                </el-cascader>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="民族："> </el-form-item>
            </el-col>
 </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="现住地址：" prop="address">
                <el-input v-model="form.address" maxlength="160"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="婚姻状况：">
                <el-radio-group>
                  <el-radio :label="0">未婚</el-radio>
                  <el-radio :label="1">已婚</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            </el-row>
          <el-row>
            
            <el-col :span="12">
              <el-form-item label="户口所在地：" prop="areaAddress">
                <el-cascader
                  placeholder="省市区"
                  style="width: 100%;"
                  :options="options"
                  :props="defaultProps"
                  v-model="form.areaAddress"
                >
                </el-cascader>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="户口性质："
                prop="email"
                :rules="[rules.email]"
              >
                <el-radio-group>
                  <el-radio :label="0">城镇</el-radio>
                  <el-radio :label="1">农业</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
             </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item
                label="E-MAIL："
                prop="email"
                :rules="[rules.email]"
              >
                <el-input v-model="form.email" maxlength="36"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="最高学历：">
                <el-select
                  filterable
                  v-model="form.type"
                  placeholder="请选择"
                  style="width: 100%;"
                >
                  <el-option
                    v-for="item in educationList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="专业：">
                <el-input v-model="form.email" maxlength="30"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="从业资格证种类：">
                <el-input v-model="form.department" maxlength="50"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="从业资格证号：">
                <el-input v-model="form.email" maxlength="50"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="从业资格证发证机构：">
                <el-input v-model="form.email" maxlength="50"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="外语等级：">
                <el-input v-model="form.department" maxlength="50"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="职业资格：">
                <el-radio-group>
                  <el-radio :label="0">否</el-radio>
                  <el-radio :label="1">是</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            </el-row>
            <el-row>
            <el-col :span="12">
              <el-form-item label="是否党员：">
                <el-radio-group>
                  <el-radio :label="0">否</el-radio>
                  <el-radio :label="1">是</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="是否在本公司工作过：">
                <el-radio-group>
                  <el-radio :label="0">否</el-radio>
                  <el-radio :label="1">是</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="个人照片：">
                 <el-upload
                    class="avatar-uploader"
                    action="https://upload-z2.qiniup.com"
                    :data="{'token':qiniuToken}"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload">
                    
                  </el-upload>
                  <el-button type="primary" size="mini">
                       {{coversUrl?'更换':'点击上传'}}
                    </el-button>
                  <img class="ml10" v-if="coversUrl"  :src="coversUrl" height="30" alt="">
                  <span v-else class="ml10 text-danger">推荐800*600</span>
              </el-form-item>
        </div>
        <p class="step-title"><span class="step-icon">2</span>主要教育经历：</p>
        <div class="dash-content" style="padding: 0 4%;">
          <el-table
            class="page-table"
            :data="listData"
            stripe
            highlight-current-row
            v-loading="listLoading"
            :cell-style="{ color: '#333' }"
          >
            <template v-for="(header, index) in tableHeaderEducation">
              <el-table-column
                v-if="header.show"
                :key="index"
                :prop="header.prop"
                :label="header.label"
                :sortable="header.sortable"
                :align="header.align"
                :min-width="header.width"
                :column-key="header.prop"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <div v-if="header.prop == 'name'">
                    <el-input
                      v-model="scope.row.name"
                      maxlength="50"
                    ></el-input>
                  </div>
                  <div v-else-if="header.prop == 'tel'">
                    <el-input v-model="scope.row.tel" maxlength="18"></el-input>
                  </div>
                  <div v-else-if="header.prop == 'position'">
                    <el-input
                      v-model="scope.row.position"
                      maxlength="36"
                    ></el-input>
                  </div>
                  <div v-else-if="header.prop == 'phone'">
                    <el-input
                      v-model="scope.row.phone"
                      maxlength="18"
                    ></el-input>
                  </div>
                  <div v-else-if="header.prop == 'email'">
                    <el-input
                      v-model="scope.row.email"
                      maxlength="36"
                    ></el-input>
                  </div>
                  <div v-else-if="header.prop == 'remarks'">
                    <el-input
                      v-model="scope.row.remarks"
                      maxlength="100"
                    ></el-input>
                  </div>
                  <div v-else>{{ scope.row[header.prop] }}</div>
                </template>
              </el-table-column>
            </template>

            <!-- <el-table-column align="left">
              <template slot="header">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-plus"
                  @click="addContactItem"></el-button>
              </template>
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-minus"
                  @click="deleteContact(scope.$index, scope.row)"></el-button>
              </template>
            </el-table-column> -->
          </el-table>
          <div class="mt10">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-plus"
              @click="addContactItem"
            ></el-button>
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-minus"
              @click="deleteContact(scope.$index, scope.row)"
            ></el-button>
          </div>
        </div>
        <p class="step-title"><span class="step-icon">3</span>主要工作经历：</p>
        <div class="dash-content" style="padding: 0 4%;">
          <el-table
            class="page-table"
            :data="listData"
            stripe
            highlight-current-row
            v-loading="listLoading"
            :cell-style="{ color: '#333' }"
          >
            <template v-for="(header, index) in tableHeaderWork">
              <el-table-column
                v-if="header.show"
                :key="index"
                :prop="header.prop"
                :label="header.label"
                :sortable="header.sortable"
                :align="header.align"
                :min-width="header.width"
                :column-key="header.prop"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <div v-if="header.prop == 'name'">
                    <el-input
                      v-model="scope.row.name"
                      maxlength="50"
                    ></el-input>
                  </div>
                  <div v-else-if="header.prop == 'tel'">
                    <el-input v-model="scope.row.tel" maxlength="18"></el-input>
                  </div>
                  <div v-else-if="header.prop == 'position'">
                    <el-input
                      v-model="scope.row.position"
                      maxlength="36"
                    ></el-input>
                  </div>
                  <div v-else-if="header.prop == 'phone'">
                    <el-input
                      v-model="scope.row.phone"
                      maxlength="18"
                    ></el-input>
                  </div>
                  <div v-else-if="header.prop == 'email'">
                    <el-input
                      v-model="scope.row.email"
                      maxlength="36"
                    ></el-input>
                  </div>
                  <div v-else-if="header.prop == 'remarks'">
                    <el-input
                      v-model="scope.row.remarks"
                      maxlength="100"
                    ></el-input>
                  </div>
                  <div v-else>{{ scope.row[header.prop] }}</div>
                </template>
              </el-table-column>
            </template>

            <!-- <el-table-column align="left">
              <template slot="header">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-plus"
                  @click="addContactItem"></el-button>
              </template>
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-minus"
                  @click="deleteContact(scope.$index, scope.row)"></el-button>
              </template>
            </el-table-column> -->
          </el-table>
          <div class="mt10">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-plus"
              @click="addContactItem"
            ></el-button>
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-minus"
              @click="deleteContact(scope.$index, scope.row)"
            ></el-button>
          </div>
        </div>
        <p class="step-title"><span class="step-icon">4</span>主要家庭成员：</p>
        <div class="dash-content" style="padding: 0 4%;">
          <el-table
            class="page-table"
            :data="listData"
            stripe
            highlight-current-row
            v-loading="listLoading"
            :cell-style="{ color: '#333' }"
          >
            <template v-for="(header, index) in tableHeaderFamily">
              <el-table-column
                v-if="header.show"
                :key="index"
                :prop="header.prop"
                :label="header.label"
                :sortable="header.sortable"
                :align="header.align"
                :min-width="header.width"
                :column-key="header.prop"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <div v-if="header.prop == 'name'">
                    <el-input
                      v-model="scope.row.name"
                      maxlength="50"
                    ></el-input>
                  </div>
                  <div v-else-if="header.prop == 'tel'">
                    <el-input v-model="scope.row.tel" maxlength="18"></el-input>
                  </div>
                  <div v-else-if="header.prop == 'position'">
                    <el-input
                      v-model="scope.row.position"
                      maxlength="36"
                    ></el-input>
                  </div>
                  <div v-else-if="header.prop == 'phone'">
                    <el-input
                      v-model="scope.row.phone"
                      maxlength="18"
                    ></el-input>
                  </div>
                  <div v-else-if="header.prop == 'email'">
                    <el-input
                      v-model="scope.row.email"
                      maxlength="36"
                    ></el-input>
                  </div>
                  <div v-else-if="header.prop == 'remarks'">
                    <el-input
                      v-model="scope.row.remarks"
                      maxlength="100"
                    ></el-input>
                  </div>
                  <div v-else>{{ scope.row[header.prop] }}</div>
                </template>
              </el-table-column>
            </template>

            <!-- <el-table-column align="left">
              <template slot="header">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-plus"
                  @click="addContactItem"></el-button>
              </template>
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-minus"
                  @click="deleteContact(scope.$index, scope.row)"></el-button>
              </template>
            </el-table-column> -->
          </el-table>
          <div class="mt10">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-plus"
              @click="addContactItem"
            ></el-button>
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-minus"
              @click="deleteContact(scope.$index, scope.row)"
            ></el-button>
          </div>
        </div>
        <p class="step-title"><span class="step-icon">5</span>紧急联系人：</p>
        <div class="dash-content" style="padding: 0 4%;">
          <el-table
            class="page-table"
            :data="listData"
            stripe
            highlight-current-row
            v-loading="listLoading"
            :cell-style="{ color: '#333' }"
          >
            <template v-for="(header, index) in tableHeaderContacts">
              <el-table-column
                v-if="header.show"
                :key="index"
                :prop="header.prop"
                :label="header.label"
                :sortable="header.sortable"
                :align="header.align"
                :min-width="header.width"
                :column-key="header.prop"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <div v-if="header.prop == 'name'">
                    <el-input
                      v-model="scope.row.name"
                      maxlength="50"
                    ></el-input>
                  </div>
                  <div v-else-if="header.prop == 'tel'">
                    <el-input v-model="scope.row.tel" maxlength="18"></el-input>
                  </div>
                  <div v-else-if="header.prop == 'position'">
                    <el-input
                      v-model="scope.row.position"
                      maxlength="36"
                    ></el-input>
                  </div>
                  <div v-else-if="header.prop == 'phone'">
                    <el-input
                      v-model="scope.row.phone"
                      maxlength="18"
                    ></el-input>
                  </div>
                  <div v-else-if="header.prop == 'email'">
                    <el-input
                      v-model="scope.row.email"
                      maxlength="36"
                    ></el-input>
                  </div>
                  <div v-else-if="header.prop == 'remarks'">
                    <el-input
                      v-model="scope.row.remarks"
                      maxlength="100"
                    ></el-input>
                  </div>
                  <div v-else>{{ scope.row[header.prop] }}</div>
                </template>
              </el-table-column>
            </template>

            <!-- <el-table-column align="left">
              <template slot="header">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-plus"
                  @click="addContactItem"></el-button>
              </template>
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-minus"
                  @click="deleteContact(scope.$index, scope.row)"></el-button>
              </template>
            </el-table-column> -->
          </el-table>
          <div class="mt10">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-plus"
              @click="addContactItem"
            ></el-button>
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-minus"
              @click="deleteContact(scope.$index, scope.row)"
            ></el-button>
          </div>
        </div>
        <p class="step-title"><span class="step-icon">6</span>人事信息：</p>

        <div class="dash-content">
          <el-row>
            <el-col :span="12">
              <el-form-item label="入职部门：" prop="department">
                <el-input v-model="form.department" maxlength="50"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="入职职务：" prop="department">
                <el-input v-model="form.department" maxlength="50"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="入职时间：" prop="department">
                <el-date-picker
     
      type="date"
      placeholder="选择日期">
    </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="员工类型：" prop="department">
                <el-select v-model="value" placeholder="请选择">
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="员工状态：" prop="department">
               <el-select v-model="value" placeholder="请选择">
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="试用期限：" prop="department">
                <el-date-picker
     
      type="datetimerange"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期">
    </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="试用期工资：" prop="department">
                <el-input v-model="form.department" maxlength="50">
                    <template slot="prepend">￥</template>
                    <template slot="append">/月</template>
                </el-input
                >
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="正式期工资：" prop="department">
                <el-input v-model="form.department" maxlength="50">
                     <template slot="prepend">￥</template>
                    <template slot="append">/月</template></el-input
                >
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="入职时间：" prop="department">
                <el-date-picker
      v-model="value1"
      type="date"
      placeholder="选择日期">
    </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="在职年限：" prop="department">
                <el-input-number  controls-position="right" @change="handleChange" :min="1" :max="10"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="转正时间：" prop="department">
                 <el-date-picker
      v-model="value1"
      type="date"
      placeholder="选择日期">
    </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="合同期限：" prop="department">
                <el-input-number  controls-position="right" @change="handleChange" :min="1" :max="10"></el-input-number>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="title">7、附件上传
          <div class="line"></div>
        </div>
        
        <div class="dash-content" >
           <div style="margin-left:20px;">
          <el-button class="mb10"  type="primary" size="small" @click="dialogVisible=true"> + 文件上传 </el-button>
         
            <el-table class="page-table" :data="form.customsAttachments" stripe highlight-current-row  :cell-style="{color:'#333'}"
            >
              <el-table-column type="index" width="50"></el-table-column>
              <template v-for="(header, index) in tableHeaderFiles">
                   <el-table-column  v-if="header.show" :key="index" :prop="header.prop"  :label="header.label" :sortable="header.sortable"
                               :align="header.align" :min-width="header.width" :column-key="header.prop" show-overflow-tooltip>
                <template slot-scope="scope">
                  <div v-if="header.prop == 'type'">
                      {{getDistsKeyName(scope.row.type)}}
                  </div>
                  <div v-else>{{scope.row[header.prop]}}</div>
                </template>
              </el-table-column>
              </template>
             
              <el-table-column label="操作" width="170">
                <template slot-scope="scope">
                  <template v-if="scope.row.key">
                    <el-button type="primary"  size="mini" @click="showFileDetails(scope.row.key)" v-if="isHasImg(scope.row.key)">预览图片</el-button>
                    <el-button type="primary"  size="mini" @click="showFileDetails(scope.row.key)" v-else-if="scope.row.key.indexOf('pdf')!=-1 || scope.row.key.indexOf('PDF')!=-1">预览PDF</el-button>
                    <el-button type="primary"  size="mini"  v-else @click="showFileDetails(scope.row.key)">下载文件</el-button>
                  </template>
                  <el-button  type="primary" size="small" @click="deleteItem(scope.row,scope.$index)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      <!-- 打印内容结束 -->
      <div class="footer m10">
        <el-button type="primary" size="medium" @click="submitForm('form', 1)"
          >提 交</el-button
        >
        <el-button
          v-if="operate === 'add'"
          type="primary"
          size="medium"
          @click="submitForm('form', 2)"
          >提交后继续创建</el-button
        >
        <el-button type="default" size="medium" @click="cancelSubmit('form')"
          >返 回</el-button
        >
      </div>
      <div style="clear: both"></div>
    </el-form>
    <ImgPreview
    :pictures="pictures"
     :isShowDialog="isShowDialogImg"
     :isFullscreen="false"
     v-if="isShowDialogImg" @closeDialog="closeDialogImg" >
     </ImgPreview>
     <FileUpload v-show="dialogVisible" 
     :isShowDialog="dialogVisible" 
     :fileTyeArr="fileTypeList" 
     :hasCallBack="hasCallBack"
      :callBackName="callBackName" 
      @getUploadFile="getUploadFile" 
      @closeDialog="closeDialog">
    </FileUpload>
  </div>
</template>

<script>
import Upload from '@/components/common/Upload'
import Api from '@/api/index'
import rules from '@/utils/rules'
import areaData from '@/api/area'
import FileUpload from '@/pages/resource/filemanage/FileUpload'
import ImgPreview from '@/components/common/ImgPreview'
export default {
  components: {
    'v-upload': Upload,
    ImgPreview,
    FileUpload
  },

  computed: {
    educationList () {
      return [
        {
          value: 0,
          label: '本科'
        }
      ]
    }
  },
  data () {
    return {
      callBackName: 'getUploadFile',
      dialogVisible: false,
      isShowDialogImg: false,
      checkedKeys: [],
      options: [],
      // 文件上传是否可多选
      isMultiple: true,
      fileListReqs: [],
      operate: '',
      flag: false,
      type: '',
      form: {
        orgIds: [],
        customerAttachmentReqs: []
      },
      /** 表格 loading */
      listLoading: false,
      rules: rules,
      uploadFileList: [],
      listData: [],
      tableHeaderFiles: [{
        prop: 'attachmentName',
        align: 'center',
        label: '名称',
        width: '100',
        show: true
      }, {
        prop: 'type',
        align: 'center',
        label: '文件类型',
        width: '200',
        show: true
      }, {
        prop: 'description',
        align: 'center',
        label: '文件描述',
        width: '200',
        show: true
      }],
      tableHeaderEducation: [
        {
          prop: 'educationAt',
          label: '教育时间',
          align: 'center',
          show: true
        },
        {
          prop: 'schoolName',
          label: '院校名称',
          align: 'center',
          show: true
        },
        {
          prop: 'position',
          label: '学历',
          align: 'center',
          show: true
        },
        {
          prop: 'phone',
          label: '专业',
          align: 'center',
          show: true
        },
        {
          prop: 'remarks',
          label: '是否统招',
          align: 'center',
          show: true
        }
      ],
      tableHeaderWork: [
        {
          prop: 'educationAt',
          label: '工作时间',
          align: 'center',
          show: true
        },
        {
          prop: 'companyName',
          label: '工单单位',
          align: 'center',
          show: true
        },
        {
          prop: 'position',
          label: '职务',
          align: 'center',
          show: true
        },
        {
          prop: 'phone',
          label: '收入',
          align: 'center',
          show: true
        },
        {
          prop: 'remarks',
          label: '证明人',
          align: 'center',
          show: true
        },
        {
          prop: 'remarks',
          label: '证明人电话',
          align: 'center',
          show: true
        },
        {
          prop: 'remarks',
          label: '离职原因',
          align: 'center',
          show: true
        }
      ],
      tableHeaderFamily: [
        {
          prop: 'name',
          label: '姓名',
          align: 'center',
          show: true
        },
        {
          prop: 'companyName',
          label: '关系',
          align: 'center',
          show: true
        },
        {
          prop: 'position',
          label: '所在单位',
          align: 'center',
          show: true
        },
        {
          prop: 'phone',
          label: '所在岗位及职务',
          align: 'center',
          show: true
        }
      ],
      tableHeaderContacts: [
        {
          prop: 'name',
          label: '姓名',
          align: 'center',
          show: true
        },
        {
          prop: 'companyName',
          label: '关系',
          align: 'center',
          show: true
        },
        {
          prop: 'position',
          label: '电话',
          align: 'center',
          show: true
        }
      ],
      treeData: [],
      options: [],
      defaultProps: {
        label: 'value',
        children: 'children'
      }
    }
  },
  mounted () {
    this.options = areaData.data
    // 组织机构
    Api.getTreeFormOrgInfo().then(data => {
      this.treeData = data
    })
    this.operate = this.$route.path === '/router/editCustomer' ? 'edit' : 'add'
    if (this.operate === 'edit') {
      this.loadData()
    }
  },
  methods: {
     /** 图片上传成功后的处理 */
    handleAvatarSuccess (res, file) {
      const key = res.key
      Api.getPicUrl(res.key).then(data => {
        this.coversUrl = data
        this.editForm.posterQiniuKey = key
      })
    },
      /** 图片上传前 */
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 6
      if (!isJPG) {
        this.$message.error('上传图片仅支付JPG,PNG格式！')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不超过6MB')
      }
      return isJPG && isLt2M
    },
    // 关闭图片预览；
    closeDialogImg () {
      this.isShowDialogImg = false
    },
        // 判断是否图片
    isHasImg (key) {
      const aFileType = ['.jpg', '.jpeg', '.png']
      return aFileType.some(item => key.toLowerCase().lastIndexOf(item) != -1)
    },
        // 文件预览处理
    showFileDetails (key) {
      let img = ''
      Api.getUrl(key).then(data => {
        if (data) {
          if (this.isHasImg(key)) {
                // 图片预览处理；
            img = data
            this.pictures = []
            this.pictures.push(img)
            this.isShowDialogImg = true
          } else {
                // 除图片的其他文件；
            window.open(data)
          }
        }
      })
    },
    closeDialog () {
      this.dialogVisible = false
    },
    getUploadFile (form) {
      this.form.customsAttachments.push({
        attachmentName: form.fileName,
        key: form.key,
        type: form.type,
        description: form.description
      })
    },
    /**
     * 选中
     */
    check: function (data, item) {
      this.form.orgIds = item.checkedKeys
    },
    /**
     * 加载客户详情
     */
    loadData () {
      this.listLoading = true

      Api.customerDetail({ id: this.$route.query.id }).then(res => {
        if (res) {
          this.form = res
          this.form.customerAttachmentReqs = []
          this.form.areaAddress = [res.country, res.province, res.city]
          if (res.contacterInfos) {
            this.listData = res.contacterInfos
          }
          if (res.orgIds) {
            this.form.orgIds = res.orgIds
            // this.checkedKeys = res.orgIds
            let arr = res.orgIds // 后台返回的id组成的数组
            let newArr = []
            let _this = this
            arr.forEach(item => {
              _this.setOrgTreeChecked(item, _this.treeData, newArr)
            })
            this.checkedKeys = newArr
          }
          // 文件上传数据回显
          this.fileListReqs = res.customerAttachments
          let _this = this
          this.fileListReqs.forEach(function (item) {
            Api.getUrl(item.key).then(data => {
              if (data) {
                _this.$set(item, 'url', data)
              }
            })
          })
        }
      })
      this.listLoading = false
    },

    setOrgTreeChecked (id, data, newArr) {
      let _this = this
      data.forEach(item => {
        if (item.orgId === id) {
          if (!item.childrens) {
            newArr.push(item.orgId)
          }
        } else {
          if (item.childrens) {
            _this.setOrgTreeChecked(id, item.childrens, newArr)
          }
        }
      })
    },
    addContactItem () {
      let item = {
        name: '',
        tel: '',
        position: '',
        email: '',
        phone: '',
        remarks: '',
        type: '002'
      }
      this.listData.push(item)
    },
    deleteContact (index, item) {
      this.listData.splice(index, 1)
    },
    /**
     * 表单提交
     */
    submitForm (formName, tag) {
      if (!this.form.orgIds || this.form.orgIds.length === 0) {
        this.$notify.warning({
          title: '提示',
          message: '请选择组织'
        })
        return
      }
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 联系人信息
          if (this.listData.length > 0) {
            this.form.contacterInfoReqList = this.listData
          }
          if (this.form.areaAddress) {
            let areaAddress = this.form.areaAddress
            this.form.country = areaAddress[0]
            this.form.province = areaAddress[1]
            this.form.city = areaAddress[2]
          }
          if (this.fileListReqs.length > 0) {
            let _this = this
            this.fileListReqs.forEach(function (item) {
              _this.form.customerAttachmentReqs.push({
                id: item.id ? item.id : '',
                attachmentName: item.name,
                key: item.attachmentUrlKey
              })
            })
          }
          if (this.operate === 'add') {
            this.addCustomer(tag)
          } else {
            this.updateCustomer()
          }
        } else {
          this.$message('请完善表单')
        }
      })
    },
    /** 添加客户 */
    addCustomer (tag) {
      this.form.type = this.$route.query.type
      Api.addCustomer(this.form).then(res => {
        if (res) {
          this.$notify.success({
            title: '提示',
            message: '客户添加成功'
          })
          if (tag === 1) {
            // this.$router.push({path: '/router/customerList'})
            this.$router.go(-1)
          } else {
            // 提交后继续创建
            this.isMultiple = true
            this.fileListReqs = []
            this.listData = []
            this.form = {
              orgIds: [],
              customerAttachmentReqs: []
            }
          }
        } else {
          this.$notify.warning({
            title: '提示',
            message: '客户添加失败'
          })
        }
      })
    },
    /** 修改客户 */
    updateCustomer () {
      this.form.id = this.$route.query.id
      this.form.type = this.$route.query.type
      Api.updateCustomer(this.form).then(res => {
        if (res) {
          this.$notify.success({
            title: '提示',
            message: '客户修改成功'
          })
          // this.$router.push({path: '/router/customerList'})
          this.$router.go(-1)
        } else {
          this.$notify.warning({
            title: '提示',
            message: '客户伙伴修改失败'
          })
        }
      })
    },
    cancelSubmit (formName) {
      this.$router.push({ path: '/router/employeeFiles' })
    }
  }
}
</script>

<style scoped>
.title {
  color: #c2272d;
  margin-bottom: 10px;
  overflow: hidden;
  height: 40px;
}

.title .line {
  border-bottom: 2px dashed #dfdfdf;
  position: relative;
  left: 80px;
  margin-top: -11px;
}

.footer {
  float: right;
  margin-top: 20px;
}
</style>
