import router from '@/router'
import store from '@/store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css' // Progress 进度条样式

router.beforeEach((to, from, next) => {

	// if (to.path == '/ltms/login') {
	// 	sessionStorage.removeItem('jwt');
	// }
    //
	// let jwt = sessionStorage.getItem('jwt');
	// if (!jwt && to.path != '/ltms/login') {
	// 	next({ path: '/ltms/login' })
	// } else {
		NProgress.start();
		next()
	// }
});

router.afterEach(transition => {
	NProgress.done();
});
