/*
 Navicat Premium Data Transfer

 Source Server         : localhost
 Source Server Type    : MySQL
 Source Server Version : 50717
 Source Host           : 127.0.0.1:3306
 Source Schema         : maoqiao

 Target Server Type    : MySQL
 Target Server Version : 50717
 File Encoding         : 65001

 Date: 31/07/2018 13:53:45
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for dev_apidoc
-- ----------------------------
DROP TABLE IF EXISTS `dev_apidoc`;
CREATE TABLE `dev_apidoc`  (
  `docid` int(11) NOT NULL AUTO_INCREMENT COMMENT '接口文档编号',
  `route` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '路由',
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '中文名称',
  `remark` varchar(2555) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '接口说明',
  `params` json NULL COMMENT '参数',
  `responsedict` json NULL COMMENT '返回结果字典',
  `response` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '返回结果示例',
  `categoryid` int(11) NULL DEFAULT NULL COMMENT '接口分类ID',
  `cache` int(11) NULL DEFAULT 0 COMMENT '缓存时长，单位分钟，0为不缓存，默认为0',
  PRIMARY KEY (`docid`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 12 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of dev_apidoc
-- ----------------------------
INSERT INTO `dev_apidoc` VALUES (1, '/api/sql/getUser', '获取用户列表2', '获取当前登录用户的用户信息', '[]', '[{\"name\": \"用户姓名\", \"field\": \"username\", \"remark\": \"用户姓名\"}, {\"name\": \"用户住址\", \"field\": \"address\", \"remark\": \"用户住址\"}, {\"name\": \"用户ID\", \"field\": \"userid\", \"remark\": \"用户ID\"}]', NULL, 1, 0);
INSERT INTO `dev_apidoc` VALUES (6, '/api/sql/getDayRain', '获取雨量', '获取日雨量', '[{\"param\": \"tm1\", \"sample\": \"2018-7-1\"}, {\"param\": \"tm2\", \"sample\": \"2018-7-5\"}]', NULL, NULL, 1, 0);
INSERT INTO `dev_apidoc` VALUES (7, '/api/base/getSqlApiList', '怎么会有这个', '怎么会有这个', NULL, NULL, NULL, 1, 0);
INSERT INTO `dev_apidoc` VALUES (8, '/api/base/upsertSqlapi', '添加sql接口', '添加sql接口', NULL, NULL, NULL, 15, 0);
INSERT INTO `dev_apidoc` VALUES (9, '/api/weather/getFY4', '风云四号卫星真彩色', '风云四号卫星真彩色，服务端使用redis缓存最新10分钟数据', NULL, '[{\"name\": \"时间\", \"field\": \"time\", \"remark\": \"时间字符串\"}, {\"name\": \"图片地址\", \"field\": \"img\", \"remark\": \"云图图片地址字符串，官方地址没有做本地存储\"}]', NULL, 16, 5);
INSERT INTO `dev_apidoc` VALUES (10, '/api/weather/test', NULL, NULL, NULL, NULL, NULL, NULL, 0);
INSERT INTO `dev_apidoc` VALUES (11, '/api/user/login', '用户登录', '用户登陆接口，此接口不被auth拦截', NULL, NULL, NULL, 1, 0);

-- ----------------------------
-- Table structure for dev_category
-- ----------------------------
DROP TABLE IF EXISTS `dev_category`;
CREATE TABLE `dev_category`  (
  `categoryid` int(11) NOT NULL AUTO_INCREMENT COMMENT '分类ID',
  `categoryname` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '分类名称',
  PRIMARY KEY (`categoryid`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 17 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of dev_category
-- ----------------------------
INSERT INTO `dev_category` VALUES (1, '接口分类一');
INSERT INTO `dev_category` VALUES (15, '接口分类二');
INSERT INTO `dev_category` VALUES (16, '气象服务');

-- ----------------------------
-- Table structure for dev_dbconfig
-- ----------------------------
DROP TABLE IF EXISTS `dev_dbconfig`;
CREATE TABLE `dev_dbconfig`  (
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `client` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `host` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `user` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `password` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `database` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of dev_dbconfig
-- ----------------------------
INSERT INTO `dev_dbconfig` VALUES ('htbus', 'mysql', '127.0.0.1', 'root', '123456', 'htbus');
INSERT INTO `dev_dbconfig` VALUES ('themesyq', 'mysql', '192.168.100.31', 'root', 'swcc1!2@3#', 'ThemeSYQDB');
INSERT INTO `dev_dbconfig` VALUES ('nbsqdb', 'mysql', '192.168.100.31', 'root', 'swcc1!2@3#', 'ht_nbsqdb');

-- ----------------------------
-- Table structure for dev_sqlapi
-- ----------------------------
DROP TABLE IF EXISTS `dev_sqlapi`;
CREATE TABLE `dev_sqlapi`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `methodname` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `dbname` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `sql` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of dev_sqlapi
-- ----------------------------
INSERT INTO `dev_sqlapi` VALUES (1, 'getUser', 'htbus', 'select * from sys_user');
INSERT INTO `dev_sqlapi` VALUES (2, 'getDayRain', 'nbsqdb', 'select a.stcd,a.stnm,a.stlc,sum(b.p) sump from st_stbprp_b a left join ThemeSYQDB.THSYQ_DailyStationRain_R b on a.stcd=b.stcd \r\nwhere a.pptn_usfl=1 \r\nand a.sttp like \'A%\' \r\nand b.time>=date_add(str_to_date({tm1}, \'%Y-%m-%d\'),interval 8 hour) \r\nand b.time<=date_add(str_to_date({tm2}, \'%Y-%m-%d\'),interval 8 hour)\r\ngroup by a.stcd,a.stnm,a.stlc');
INSERT INTO `dev_sqlapi` VALUES (3, 'delDayRain', 'nbsqdb', 'select a.stcd,a.stnm,a.stlc,sum(b.p) sump from st_stbprp_b a left join ThemeSYQDB.THSYQ_DailyStationRain_R b on a.stcd=b.stcd \r\nwhere a.pptn_usfl=1 \r\nand a.sttp like \'A%\' \r\nand b.time>=date_add(str_to_date({tm1}, \'%Y-%m-%d\'),interval 8 hour) \r\nand b.time<=date_add(str_to_date({tm2}, \'%Y-%m-%d\'),interval 8 hour)\r\ngroup by a.stcd,a.stnm,a.stlc');
INSERT INTO `dev_sqlapi` VALUES (4, 'addDayRain', 'nbsqdb', 'select a.stcd,a.stnm,a.stlc,sum(b.p) sump from st_stbprp_b a left join ThemeSYQDB.THSYQ_DailyStationRain_R b on a.stcd=b.stcd \r\nwhere a.pptn_usfl=1 \r\nand a.sttp like \'A%\' \r\nand b.time>=date_add(str_to_date({tm1}, \'%Y-%m-%d\'),interval 8 hour) \r\nand b.time<=date_add(str_to_date({tm2}, \'%Y-%m-%d\'),interval 8 hour)\r\ngroup by a.stcd,a.stnm,a.stlc');
INSERT INTO `dev_sqlapi` VALUES (5, 'updateDayRain', 'nbsqdb', 'select a.stcd,a.stnm,a.stlc,sum(b.p) sump from st_stbprp_b a left join ThemeSYQDB.THSYQ_DailyStationRain_R b on a.stcd=b.stcd \r\nwhere a.pptn_usfl=1 \r\nand a.sttp like \'A%\' \r\nand b.time>=date_add(str_to_date({tm1}, \'%Y-%m-%d\'),interval 8 hour) \r\nand b.time<=date_add(str_to_date({tm2}, \'%Y-%m-%d\'),interval 8 hour)\r\ngroup by a.stcd,a.stnm,a.stlc');

-- ----------------------------
-- Table structure for sys_dept
-- ----------------------------
DROP TABLE IF EXISTS `sys_dept`;
CREATE TABLE `sys_dept`  (
  `dept_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `pid` bigint(20) NULL DEFAULT NULL COMMENT '上级部门ID，一级部门为0',
  `dept_name` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '部门名称',
  `order_num` double(20, 2) NOT NULL COMMENT '排序',
  PRIMARY KEY (`dept_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 8 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '组织机构表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_dept
-- ----------------------------
INSERT INTO `sys_dept` VALUES (1, 0, '弘泰水利有限公司', 100.00);
INSERT INTO `sys_dept` VALUES (2, 1, '数云部', 200.00);
INSERT INTO `sys_dept` VALUES (3, 1, '软件部', 300.00);
INSERT INTO `sys_dept` VALUES (4, 1, '咨询部', 400.00);
INSERT INTO `sys_dept` VALUES (5, 1, '工程部', 500.00);
INSERT INTO `sys_dept` VALUES (6, 2, '地图组', 100.00);
INSERT INTO `sys_dept` VALUES (7, 2, '视频组', 200.00);

-- ----------------------------
-- Table structure for sys_dist
-- ----------------------------
DROP TABLE IF EXISTS `sys_dist`;
CREATE TABLE `sys_dist`  (
  `addvcd` int(6) NOT NULL COMMENT '行政区划码',
  `addvnm` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '行政区划名称',
  PRIMARY KEY (`addvcd`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '行政区划表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_dist
-- ----------------------------
INSERT INTO `sys_dist` VALUES (330201, '市辖区');
INSERT INTO `sys_dist` VALUES (330203, '海曙区');
INSERT INTO `sys_dist` VALUES (330204, '江东区');
INSERT INTO `sys_dist` VALUES (330205, '江北区');
INSERT INTO `sys_dist` VALUES (330206, '北仑区');
INSERT INTO `sys_dist` VALUES (330211, '镇海区');
INSERT INTO `sys_dist` VALUES (330212, '鄞州区');
INSERT INTO `sys_dist` VALUES (330225, '象山县');
INSERT INTO `sys_dist` VALUES (330226, '宁海县');
INSERT INTO `sys_dist` VALUES (330281, '余姚市');
INSERT INTO `sys_dist` VALUES (330282, '慈溪市');
INSERT INTO `sys_dist` VALUES (330283, '奉化区');

-- ----------------------------
-- Table structure for sys_log
-- ----------------------------
DROP TABLE IF EXISTS `sys_log`;
CREATE TABLE `sys_log`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `logtm` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP COMMENT '日志时间',
  `logtype` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '日志类别，自行设置',
  `logmsg` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '日志信息',
  `user` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '用户信息，自行设置',
  `tag1` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '其他信息1',
  `tag2` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '其他信息2',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for sys_menu
-- ----------------------------
DROP TABLE IF EXISTS `sys_menu`;
CREATE TABLE `sys_menu`  (
  `menu_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `pid` bigint(20) NULL DEFAULT NULL COMMENT '父菜单ID，一级菜单为0',
  `name` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '菜单名称',
  `path` varchar(200) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '菜单URL',
  `component` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `type` int(4) NULL DEFAULT NULL COMMENT '菜单类型 100 模块 200 iframe 300 链接',
  `icon` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `icon2` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '菜单图标',
  `disabled` tinyint(4) NULL DEFAULT 0 COMMENT '是否可用 1：不可用 0：可用',
  `hidden` tinyint(4) NULL DEFAULT 0 COMMENT '是否可见  1：不可见 0：可见',
  `redirect` varchar(200) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '菜单重定向',
  `order_num` double(20, 2) NOT NULL COMMENT '排序',
  `perms` varchar(500) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '授权(多个用逗号分隔，如：user:list,user:create)',
  `leaf` tinyint(4) NULL DEFAULT 0 COMMENT '该参数用于判断菜单是否有子节点',
  `del_flag` tinyint(4) NULL DEFAULT 0 COMMENT '删除标记  1：已删除  0：正常',
  `menu_type` int(11) NULL DEFAULT NULL COMMENT '类型   0：目录   1：菜单   2：按钮',
  PRIMARY KEY (`menu_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 96 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '菜单模块表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_menu
-- ----------------------------
INSERT INTO `sys_menu` VALUES (1, 0, '防汛模块', '/', 'layout/app', 100, 'icon-shoubing', 'icon-command', 0, 0, '', 1.00, 'fx,sq', 0, 0, NULL);
INSERT INTO `sys_menu` VALUES (2, 0, '平台资源', '/', 'layout/app', 100, 'icon-feibiao', 'icon-config', 0, 0, NULL, 3.50, NULL, 0, 0, NULL);
INSERT INTO `sys_menu` VALUES (3, 0, '审核授权', '/', 'layout/app', 100, 'icon-youxiqia', 'icon-disaster', 0, 0, NULL, 3.00, NULL, 0, 0, NULL);
INSERT INTO `sys_menu` VALUES (4, 0, '跳转测试', '/', 'http://www.baidu.com', 300, 'icon-yaogan', 'icon-entrance', 0, 0, NULL, 4.00, NULL, 1, 0, NULL);
INSERT INTO `sys_menu` VALUES (5, 0, '平台监控', '/', 'layout/app', 100, 'icon-jimu', 'icon-flood', 0, 0, NULL, 5.00, NULL, 0, 0, NULL);
INSERT INTO `sys_menu` VALUES (6, 0, '报表统计', '/', 'layout/app', 100, 'icon-bingtuoluo', 'icon-forecast', 0, 0, NULL, 6.00, NULL, 0, 0, NULL);
INSERT INTO `sys_menu` VALUES (7, 0, '系统管理', '/', 'layout/app', 100, 'icon-guojixiangqi', 'icon-hydro', 0, 0, NULL, 7.00, NULL, 0, 0, NULL);
INSERT INTO `sys_menu` VALUES (9, 0, '组织机构', '/', 'layout/app', 100, 'icon-budaoweng', 'icon-integrate', 0, 0, NULL, 8.00, NULL, 0, 0, NULL);
INSERT INTO `sys_menu` VALUES (11, 1, '点雨量', '/dotRain', 'modules/dotrain', 100, 'icon-che', 'icon-warning', 0, 0, NULL, 9.00, NULL, 0, 0, NULL);
INSERT INTO `sys_menu` VALUES (12, 1, '面雨量', '/regionRain', 'modules/test', 100, 'icon-fengzheng', NULL, 0, 0, NULL, 8.50, NULL, 0, 0, NULL);
INSERT INTO `sys_menu` VALUES (15, 1, '调水实时监控', '/dsrealtime', 'fx/dsrealtime/DsRealTime', 100, 'icon-fengche', NULL, 0, 0, NULL, 11.00, NULL, 0, 0, NULL);
INSERT INTO `sys_menu` VALUES (21, 2, '应用系统', '/app', 'fx/Hello', 100, 'icon-shoubing', NULL, 0, 0, NULL, 12.00, NULL, 0, 0, NULL);
INSERT INTO `sys_menu` VALUES (22, 2, '数据资源', '/data', 'fx/Hello', 100, 'icon-feibiao', NULL, 0, 0, NULL, 13.00, NULL, 0, 0, NULL);
INSERT INTO `sys_menu` VALUES (23, 2, '服务资源', '/update', 'fx/Hello', 100, 'icon-youxiqia', NULL, 0, 0, NULL, 14.00, NULL, 0, 0, NULL);
INSERT INTO `sys_menu` VALUES (24, 2, '文档资源', '/sta', 'fx/Hello', 100, 'icon-yaogan', NULL, 0, 0, NULL, 15.00, NULL, 0, 0, NULL);
INSERT INTO `sys_menu` VALUES (31, 3, '服务申请审核', '/sq', 'fx/Hello', 100, 'icon-jimu', NULL, 0, 0, NULL, 16.00, NULL, 0, 0, NULL);
INSERT INTO `sys_menu` VALUES (32, 3, '服务统一授权', '/ty', 'fx/Hello', 100, 'icon-bingtuoluo', NULL, 0, 0, NULL, 17.00, NULL, 0, 0, NULL);
INSERT INTO `sys_menu` VALUES (51, 5, '服务监控', '/jk', 'fx/Hello', 100, 'icon-budaoweng', NULL, 0, 0, NULL, 19.00, NULL, 0, 0, NULL);
INSERT INTO `sys_menu` VALUES (52, 5, '服务请求监控', '/qj', 'fx/Hello', 100, 'icon-che', NULL, 0, 0, NULL, 20.00, NULL, 0, 0, NULL);
INSERT INTO `sys_menu` VALUES (61, 6, '应用资源统计', '/zy', 'fx/Hello', 100, 'icon-fengzheng', NULL, 0, 0, NULL, 21.00, NULL, 0, 0, NULL);
INSERT INTO `sys_menu` VALUES (62, 6, '平台支撑统计', '/zc', 'fx/Hello', 100, 'icon-fengche', NULL, 0, 0, NULL, 22.00, NULL, 0, 0, NULL);
INSERT INTO `sys_menu` VALUES (63, 6, '服务请求统计', '/zz', 'fx/Hello', 100, 'icon-shoubing', NULL, 0, 0, NULL, 23.00, NULL, 0, 0, NULL);
INSERT INTO `sys_menu` VALUES (71, 7, '菜单管理', '/menu', 'common/MenuManager', 100, 'icon-feibiao', NULL, 0, 0, NULL, 24.00, NULL, 0, 0, NULL);
INSERT INTO `sys_menu` VALUES (72, 7, '用户管理', '/user', 'common/UserManager', 100, 'icon-youxiqia', NULL, 0, 0, NULL, 25.00, NULL, 0, 0, NULL);
INSERT INTO `sys_menu` VALUES (73, 7, '系统消息', '/rumei', 'fx/Hello', 100, 'icon-yaogan', NULL, 0, 0, NULL, 26.00, NULL, 0, 0, NULL);
INSERT INTO `sys_menu` VALUES (75, 7, '数据库', '/data', 'fx/Hello', 100, 'icon-jimu', NULL, 0, 0, NULL, 27.00, NULL, 0, 0, NULL);
INSERT INTO `sys_menu` VALUES (92, 9, '组织机构管理', '/org', 'role/Organization', 100, 'icon-bingtuoluo', NULL, 1, 0, NULL, 28.00, NULL, 0, 0, NULL);
INSERT INTO `sys_menu` VALUES (93, 9, '岗位管理', '/post', 'fx/Hello', 100, 'icon-guojixiangqi', NULL, 1, 0, NULL, 29.00, NULL, 0, 0, NULL);
INSERT INTO `sys_menu` VALUES (94, 9, '角色管理', '/role', 'role/RoleManager', 100, 'icon-budaoweng', NULL, 1, 0, NULL, 30.00, NULL, 0, 0, NULL);
INSERT INTO `sys_menu` VALUES (95, 1, '等值面配置', '/iso', 'modules/iso', 100, NULL, NULL, 0, 0, NULL, 11.50, NULL, 0, 0, NULL);

-- ----------------------------
-- Table structure for sys_resource
-- ----------------------------
DROP TABLE IF EXISTS `sys_resource`;
CREATE TABLE `sys_resource`  (
  `resource_id` bigint(20) NOT NULL,
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `details` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `url` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `method` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT 'ALL',
  `remark` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`resource_id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for sys_role
-- ----------------------------
DROP TABLE IF EXISTS `sys_role`;
CREATE TABLE `sys_role`  (
  `role_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `role_name` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '角色名称',
  `remark` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '备注',
  `dept_id` bigint(20) NULL DEFAULT NULL COMMENT '部门ID',
  `create_time` datetime(0) NULL DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`role_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '用户角色表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_role
-- ----------------------------
INSERT INTO `sys_role` VALUES (1, 'ROLE_ADMIN', '1', 6, NULL);
INSERT INTO `sys_role` VALUES (2, 'ROLE_GENERAL', '2', 4, '2018-04-24 11:01:28');

-- ----------------------------
-- Table structure for sys_role_menu
-- ----------------------------
DROP TABLE IF EXISTS `sys_role_menu`;
CREATE TABLE `sys_role_menu`  (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `role_id` bigint(20) NULL DEFAULT NULL COMMENT '角色ID',
  `menu_id` bigint(20) NULL DEFAULT NULL COMMENT '菜单ID',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 67 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '角色菜单模块权限表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_role_menu
-- ----------------------------
INSERT INTO `sys_role_menu` VALUES (1, 1, 2);
INSERT INTO `sys_role_menu` VALUES (2, 1, 3);
INSERT INTO `sys_role_menu` VALUES (3, 1, 4);
INSERT INTO `sys_role_menu` VALUES (4, 1, 5);
INSERT INTO `sys_role_menu` VALUES (5, 1, 6);
INSERT INTO `sys_role_menu` VALUES (6, 1, 7);
INSERT INTO `sys_role_menu` VALUES (7, 1, 9);
INSERT INTO `sys_role_menu` VALUES (8, 1, 11);
INSERT INTO `sys_role_menu` VALUES (9, 1, 12);
INSERT INTO `sys_role_menu` VALUES (10, 1, 15);
INSERT INTO `sys_role_menu` VALUES (11, 1, 21);
INSERT INTO `sys_role_menu` VALUES (12, 1, 22);
INSERT INTO `sys_role_menu` VALUES (13, 1, 23);
INSERT INTO `sys_role_menu` VALUES (14, 1, 24);
INSERT INTO `sys_role_menu` VALUES (15, 1, 31);
INSERT INTO `sys_role_menu` VALUES (16, 1, 32);
INSERT INTO `sys_role_menu` VALUES (18, 1, 51);
INSERT INTO `sys_role_menu` VALUES (19, 1, 52);
INSERT INTO `sys_role_menu` VALUES (20, 1, 61);
INSERT INTO `sys_role_menu` VALUES (21, 1, 62);
INSERT INTO `sys_role_menu` VALUES (22, 1, 63);
INSERT INTO `sys_role_menu` VALUES (23, 1, 71);
INSERT INTO `sys_role_menu` VALUES (24, 1, 72);
INSERT INTO `sys_role_menu` VALUES (25, 1, 73);
INSERT INTO `sys_role_menu` VALUES (26, 1, 75);
INSERT INTO `sys_role_menu` VALUES (27, 1, 92);
INSERT INTO `sys_role_menu` VALUES (28, 1, 93);
INSERT INTO `sys_role_menu` VALUES (29, 1, 94);
INSERT INTO `sys_role_menu` VALUES (65, 1, 1);
INSERT INTO `sys_role_menu` VALUES (66, 1, 95);

-- ----------------------------
-- Table structure for sys_user
-- ----------------------------
DROP TABLE IF EXISTS `sys_user`;
CREATE TABLE `sys_user`  (
  `user_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '用户名',
  `password` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '密码',
  `realname` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '用户真名',
  `email` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '邮箱',
  `mobile` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '手机号',
  `status` tinyint(4) NULL DEFAULT 1 COMMENT '状态  0：禁用   1：正常',
  `dept_id` bigint(20) NULL DEFAULT NULL COMMENT '部门ID',
  `addvcd` int(6) NULL DEFAULT NULL COMMENT '所属区县id',
  `order_num` double(20, 2) NULL DEFAULT NULL COMMENT '排序',
  `create_time` datetime(0) NULL DEFAULT NULL COMMENT '创建时间',
  `wxid` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '微信用户的openid',
  PRIMARY KEY (`user_id`) USING BTREE,
  UNIQUE INDEX `username`(`username`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 20 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '用户表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_user
-- ----------------------------
INSERT INTO `sys_user` VALUES (1, 'jokki', '$2a$10$uxyc3muaiwsy7X/gKrc5leNi/EtIRt9A.0aABl6IzG70kJKckUWku', NULL, NULL, NULL, 1, NULL, NULL, 100.00, NULL, NULL);
INSERT INTO `sys_user` VALUES (2, 'hjw', '$2a$10$GkHX6wBw7LphFOx7YJo5musxXqRjdloPgfbtcHNmB.fCf9p8PiJIO', NULL, NULL, NULL, 1, NULL, NULL, 200.00, NULL, NULL);
INSERT INTO `sys_user` VALUES (4, 'admin', 'admin', '管理员2', NULL, NULL, 1, NULL, NULL, 300.00, NULL, 'oCn9v0_vAsFHHe6CB7rlxcxkn1lE');
INSERT INTO `sys_user` VALUES (14, 'maoqiao', '$2a$10$ac4fcs.JPHQnfzvr/Ko0xutAFfa9tFRTVjTci56HTxzrTRqRNk2p.', NULL, NULL, NULL, 1, NULL, NULL, 400.00, '2018-04-18 15:45:32', '');
INSERT INTO `sys_user` VALUES (15, 'test1', '$2a$10$Rvji9zOlsVV7NQUlybubH.wLZltgv/b03uVmeh3rp7fEQuMQio5Ka', NULL, '11', '1231', 1, NULL, NULL, 500.00, '2018-04-18 15:49:32', NULL);
INSERT INTO `sys_user` VALUES (17, 'maoqiao1', '$2a$10$QtL7yxG5k.ROoch060o4x.VCF/Y5fBbHUNlFBEhH9GkwQCXE29/9K', NULL, NULL, NULL, 1, NULL, NULL, 600.00, '2018-04-18 16:28:44', NULL);
INSERT INTO `sys_user` VALUES (18, 'maoqiao2', '$2a$10$n5OdjgjEtYd9aWCNH8Euje2SxqKj.5BpdNGbmMbDc11HVs0w5eSyi', NULL, NULL, NULL, 1, NULL, NULL, 700.00, '2018-04-18 16:29:09', NULL);
INSERT INTO `sys_user` VALUES (19, 'zzz', '$2a$10$XC84H3LHC685x8la2N4xxuo1GIhFAwpl.K.99qxOdUCxwiNbVe2..', NULL, '', '', 1, NULL, NULL, 800.00, '2018-04-19 16:31:23', NULL);

-- ----------------------------
-- Table structure for sys_user_role
-- ----------------------------
DROP TABLE IF EXISTS `sys_user_role`;
CREATE TABLE `sys_user_role`  (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) NULL DEFAULT NULL COMMENT '用户ID',
  `role_id` bigint(20) NULL DEFAULT NULL COMMENT '角色ID',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 14 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '用户角色表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_user_role
-- ----------------------------
INSERT INTO `sys_user_role` VALUES (1, 4, 1);
INSERT INTO `sys_user_role` VALUES (13, 1, 2);

SET FOREIGN_KEY_CHECKS = 1;
