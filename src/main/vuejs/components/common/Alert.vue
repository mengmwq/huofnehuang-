<template>
	<div class="tanchu_tishichuang">
	<el-col  class="content-notification" v-show="this.messageList && this.messageList.length > 0">
		<el-row class = "notification-item " v-bind:class="{ success: m.type == 'success', error : m.type == 'error' }" v-for="(m,index) in messageAlertList" :key = "index">
			<!--error  primary   info-->
			<el-col :span="18">
				{{m.value}}
			</el-col>
			<el-col :span="5" :offset="1">{{getFormatTime(m.time)}}</el-col>
		</el-row>
		<el-row class="notification-title" @click = "showListChange">
			<el-col :span="20">
				<el-col :span="5">通知</el-col>
				<el-col :span="4" v-show = "messageAlertCount">
					<span class="notification-count">{{messageAlertCount}}</span>
				</el-col>
			</el-col>
			<el-col :span="4">
				<i class="el-icon-arrow-up" :class="isShow(isShow)" @click = "showListChange"></i>
				<i class="el-icon-close" @click="clearAllMessage" title="清空"></i>
			</el-col>
		</el-row>
		<el-row v-show="showList">
			<el-row class="notification-item" v-for="(message,index) in messageList"  :key = "index" >
				<el-col :span="18" >
					{{message.value}}
				</el-col>
				<el-col :span="5" :offset="1">{{getFormatTime(message.time)}}</el-col>
			</el-row>
		</el-row>
	</el-col>
	</div>
</template>
<script>
	import TimeFormat from '@/utils/TimeFormat';
	export default {
		components: {

		},
		computed: {
			messageList(){
				let messageObj = this.$store.state.message.messageObj;
				if(messageObj){
					console.log(messageObj.messageList,'mess')
					if(messageObj.messageList.length>5){
						return messageObj.messageList.slice(-5);
					}else{
						return messageObj.messageList;
					}
				}else{
					return []
				}
			},
			messageAlertList(){
				let messageObj = this.$store.state.message.messageObj;
				return messageObj && messageObj.messageAlertList;
			},
			messageAlertCount(){
				let messageObj = this.$store.state.message.messageObj;
				return messageObj && messageObj.messageAlertCount;
			}
		},
		data () {
			return {
				showList: false,
			}
		},
		mounted() {
		},

		methods: {
			isShow(isshow){
				return this.showList === false? 'el-icon-arrow-down':'el-icon-arrow-up'
			},
			showListChange () {
				this.showList = !this.showList;
				this.$store.dispatch('cleanMessageAlertCount');
			},
			clearAllMessage () {
				this.$store.dispatch('cleanMessageList');
			},
			getFormatTime (time) {
				return TimeFormat.Format(time, 'hh:mm:ss')
			},
			getClass (message) {
				return `${message.type}`
			},

		}
	}

</script>
<style lang="scss">
	.content-notification {
		width: 300px !important;
		position: fixed;
		right: 14px;
		bottom: 32px;
		z-index: 19999;
		/* max-height: 800px;
		overflow: auto; */
	.notification-title {
		padding-left:15px;
		height:42px;
		line-height: 42px;
		color:#fff;
		background:#185A9B;
		// bottom: -30px;
	}

	.notification-count {
		background:#FFBA00;
		border-radius: 50px;
		padding:3px;
		color:#333;
	}
	.notification-item{
		background: #fff;
		border:1px solid #185A9B;
		padding:10px;
		font-size:14px;
		line-height: 1.8;
		word-break: break-all;
	p {
		padding:0;
		margin:0;
	}
	}
	.default {
		border:1px solid #17599A;
		background-color:#fff;
	}
	.info {

		border:1px solid #FEA900;
		background-color: #F3E8D2;
	}
	.success {
		/* @include borderBg(#86CF67,#DCEFD4); */
		border:1px solid #86CF67;
		background-color:#DCEFD4;
	}
	.error {

		border:1px solid #FE5454;
		background-color:#FDEAEA;
	}
	.primary {
		border:1px solid #2CB6F4;
		background-color:#CDEDFC;
	}
}
</style>
