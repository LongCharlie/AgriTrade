/*
 Navicat Premium Data Transfer
 Source Server         : long
 Source Server Type    : MySQL
 Source Server Version : 80041
 Source Host           : localhost:3306
 Source Schema         : agritrade
 Target Server Type    : MySQL
 Target Server Version : 80041
 File Encoding         : 65001
 Date: 20/06/2025 23:01:07
*/
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for after_sale_audits
-- ----------------------------
DROP TABLE IF EXISTS `after_sale_audits`;
CREATE TABLE `after_sale_audits`  (
  `audit_id` int NOT NULL AUTO_INCREMENT COMMENT '审核ID',
  `order_id` int NOT NULL COMMENT '关联订单ID',
  `admin_id` int NOT NULL COMMENT '审核管理员ID',
  `decision` enum('approve','reject') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '审核决定',
  `reason` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '审核理由',
  `audited_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '审核时间',
  PRIMARY KEY (`audit_id`) USING BTREE,
  INDEX `admin_id`(`admin_id`) USING BTREE,
  INDEX `order_decision_idx`(`order_id`, `decision`) USING BTREE,
  CONSTRAINT `after_sale_audits_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `after_sale_audits_ibfk_2` FOREIGN KEY (`admin_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for answers
-- ----------------------------
DROP TABLE IF EXISTS `answers`;
CREATE TABLE `answers`  (
  `answer_id` int NOT NULL AUTO_INCREMENT COMMENT '回答ID',
  `question_id` int NOT NULL COMMENT '关联问题ID',
  `expert_id` int NULL DEFAULT NULL COMMENT '回答专家ID',
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '回答内容',
  `answered_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '回答时间',
  `upvotes` int NULL DEFAULT 0 COMMENT '点赞数',
  PRIMARY KEY (`answer_id`) USING BTREE,
  INDEX `question_id`(`question_id`) USING BTREE,
  INDEX `expert_id`(`expert_id`) USING BTREE,
  CONSTRAINT `answers_ibfk_1` FOREIGN KEY (`question_id`) REFERENCES `questions` (`question_id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `answers_ibfk_2` FOREIGN KEY (`expert_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for certificates
-- ----------------------------
DROP TABLE IF EXISTS `certificates`;
CREATE TABLE `certificates`  (
  `certificate_id` int NOT NULL AUTO_INCREMENT COMMENT '证书ID，主键',
  `expert_id` int NULL DEFAULT NULL COMMENT '专家ID，外键',
  `obtain_time` date NOT NULL COMMENT '获得时间，格式YYYY-MM-DD',
  `level` tinyint NOT NULL COMMENT '等级',
  `valid_period` smallint NOT NULL COMMENT '有效期(年)',
  `authorizing_unit` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '中国农业协会' COMMENT '授权单位',
  `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT '暂无描述' COMMENT '描述',
  `status` enum('valid','expired') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT 'valid' COMMENT '证书状态',
  PRIMARY KEY (`certificate_id`) USING BTREE,
  INDEX `expert_id`(`expert_id`) USING BTREE,
  CONSTRAINT `certificates_ibfk_1` FOREIGN KEY (`expert_id`) REFERENCES `experts` (`expert_id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for communications
-- ----------------------------
DROP TABLE IF EXISTS `communications`;
CREATE TABLE `communications`  (
  `comm_id` int NOT NULL AUTO_INCREMENT COMMENT '沟通ID',
  `application_id` int NOT NULL COMMENT '关联采购申请ID',
  `sender_id` int NOT NULL COMMENT '发送方ID',
  `receiver_id` int NOT NULL COMMENT '接收方ID',
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '消息内容',
  `image_path` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '图片路径',
  `sent_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '发送时间',
  PRIMARY KEY (`comm_id`) USING BTREE,
  INDEX `sender_id`(`sender_id`) USING BTREE,
  INDEX `receiver_id`(`receiver_id`) USING BTREE,
  INDEX `application_sent_at_idx`(`application_id`, `sent_at`) USING BTREE,
  CONSTRAINT `communications_ibfk_1` FOREIGN KEY (`application_id`) REFERENCES `purchase_applications` (`application_id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `communications_ibfk_2` FOREIGN KEY (`sender_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `communications_ibfk_3` FOREIGN KEY (`receiver_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for experience_comments
-- ----------------------------
DROP TABLE IF EXISTS `experience_comments`;
CREATE TABLE `experience_comments`  (
  `comment_id` int NOT NULL AUTO_INCREMENT COMMENT '评论ID',
  `experience_id` int NOT NULL COMMENT '关联经验分享ID',
  `user_id` int NOT NULL COMMENT '评论者ID',
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '评论内容',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '评论时间',
  PRIMARY KEY (`comment_id`) USING BTREE,
  INDEX `user_id`(`user_id`) USING BTREE,
  INDEX `exp_created_idx`(`experience_id`, `created_at`) USING BTREE,
  CONSTRAINT `experience_comments_ibfk_1` FOREIGN KEY (`experience_id`) REFERENCES `experiences` (`experience_id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `experience_comments_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for experiences
-- ----------------------------
DROP TABLE IF EXISTS `experiences`;
CREATE TABLE `experiences`  (
  `experience_id` int NOT NULL AUTO_INCREMENT COMMENT '经验ID',
  `user_id` int NOT NULL COMMENT '分享用户ID',
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '分享标题',
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '分享内容',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `audit_status` enum('pending','approved','rejected') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT 'pending' COMMENT '审核状态',
  PRIMARY KEY (`experience_id`) USING BTREE,
  INDEX `user_id`(`user_id`) USING BTREE,
  INDEX `audit_status_idx`(`audit_status`) USING BTREE,
  FULLTEXT INDEX `content_ft_idx`(`title`, `content`),
  CONSTRAINT `experiences_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for experts
-- ----------------------------
DROP TABLE IF EXISTS `experts`;
CREATE TABLE `experts`  (
  `expert_id` int NOT NULL COMMENT '专家ID（关联用户ID）',
  `real_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '真实姓名',
  `title` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '职称',
  `institution` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '所属机构',
  `expertise` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '专业领域',
  `answer_count` int NULL DEFAULT NULL COMMENT '回答数',
  `expert_rank` int NULL DEFAULT NULL COMMENT '专家排行',
  `bio` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '个人简介',
  PRIMARY KEY (`expert_id`) USING BTREE,
  INDEX `expertise_idx`(`expertise`) USING BTREE,
  CONSTRAINT `experts_ibfk_1` FOREIGN KEY (`expert_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for farming_activities
-- ----------------------------
DROP TABLE IF EXISTS `farming_activities`;
CREATE TABLE `farming_activities`  (
  `activity_id` int NOT NULL AUTO_INCREMENT COMMENT '活动ID',
  `record_id` int NOT NULL COMMENT '关联种植记录ID',
  `activity_date` date NOT NULL COMMENT '操作日期',
  `activity_type` enum('seeding','fertilizing','pesticide','harvest','other') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '操作类型',
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '操作描述',
  `images` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '图片路径（多个用逗号分隔）',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '记录时间',
  PRIMARY KEY (`activity_id`) USING BTREE,
  INDEX `record_id`(`record_id`) USING BTREE,
  INDEX `activity_date_idx`(`activity_date`) USING BTREE,
  CONSTRAINT `farming_activities_ibfk_1` FOREIGN KEY (`record_id`) REFERENCES `planting_records` (`record_id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for orders
-- ----------------------------
DROP TABLE IF EXISTS `orders`;
CREATE TABLE `orders`  (
  `order_id` int NOT NULL AUTO_INCREMENT COMMENT '订单ID',
  `farmer_id` int NOT NULL COMMENT '农户ID',
  `buyer_id` int NOT NULL COMMENT '采购商ID',
  `application_id` int NULL DEFAULT NULL COMMENT '关联申请ID',
  `status` enum('pending_shipment','shipped','completed','after_sale_requested','after_sale_resolved') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT 'pending_shipment' COMMENT '订单状态',
  `shipment_time` datetime NULL DEFAULT NULL COMMENT '发货时间',
  `buyer_confirm_time` datetime NULL DEFAULT NULL COMMENT '确认收货时间',
  `after_sale_reason` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '售后原因',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`order_id`) USING BTREE,
  UNIQUE INDEX `application_id`(`application_id`) USING BTREE,
  INDEX `farmer_id`(`farmer_id`) USING BTREE,
  INDEX `buyer_id`(`buyer_id`) USING BTREE,
  INDEX `status_idx`(`status`) USING BTREE,
  INDEX `created_at_idx`(`created_at`) USING BTREE,
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`application_id`) REFERENCES `purchase_applications` (`application_id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`farmer_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `orders_ibfk_3` FOREIGN KEY (`buyer_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for planting_records
-- ----------------------------
DROP TABLE IF EXISTS `planting_records`;
CREATE TABLE `planting_records`  (
  `record_id` int NOT NULL AUTO_INCREMENT COMMENT '记录ID',
  `farmer_id` int NOT NULL COMMENT '农户ID',
  `product_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '作物品种',
  `province` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '种植省份',
  `growth_status` enum('growing','harvested') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT 'growing' COMMENT '种植状态',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`record_id`) USING BTREE,
  INDEX `farmer_product_idx`(`farmer_id`, `product_name`) USING BTREE,
  INDEX `growth_status_idx`(`growth_status`) USING BTREE,
  INDEX `province_idx`(`province`) USING BTREE,
  CONSTRAINT `planting_records_ibfk_1` FOREIGN KEY (`farmer_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for price_references
-- ----------------------------
DROP TABLE IF EXISTS `price_references`;
CREATE TABLE `price_references`  (
  `price_id` int NOT NULL AUTO_INCREMENT COMMENT '价格ID',
  `product_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '产品名称',
  `province` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '省份',
  `avg_price` decimal(10, 2) NOT NULL COMMENT '平均价格',
  `update_date` date NOT NULL COMMENT '更新日期',
  PRIMARY KEY (`price_id`) USING BTREE,
  UNIQUE INDEX `product_location_idx`(`product_name`, `province`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for purchase_applications
-- ----------------------------
DROP TABLE IF EXISTS `purchase_applications`;
CREATE TABLE `purchase_applications`  (
  `application_id` int NOT NULL AUTO_INCREMENT COMMENT '申请ID',
  `demand_id` int NOT NULL COMMENT '需求ID',
  `farmer_id` int NOT NULL COMMENT '农户ID',
  `record_id` int NULL DEFAULT NULL COMMENT '关联种植记录ID',
  `quantity` decimal(10, 2) NOT NULL COMMENT '供货数量',
  `price` decimal(10, 2) NOT NULL COMMENT '报价',
  `province` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '供货省份',
  `status` enum('pending','accepted','rejected') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT 'pending' COMMENT '申请状态',
  `applied_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '申请时间',
  PRIMARY KEY (`application_id`) USING BTREE,
  INDEX `farmer_id`(`farmer_id`) USING BTREE,
  INDEX `record_id`(`record_id`) USING BTREE,
  INDEX `demand_status_idx`(`demand_id`, `status`) USING BTREE,
  INDEX `province_idx`(`province`) USING BTREE,
  CONSTRAINT `purchase_applications_ibfk_1` FOREIGN KEY (`demand_id`) REFERENCES `purchase_demands` (`demand_id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `purchase_applications_ibfk_2` FOREIGN KEY (`farmer_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `purchase_applications_ibfk_3` FOREIGN KEY (`record_id`) REFERENCES `planting_records` (`record_id`) ON DELETE SET NULL ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for purchase_demands
-- ----------------------------
DROP TABLE IF EXISTS `purchase_demands`;
CREATE TABLE `purchase_demands`  (
  `demand_id` int NOT NULL AUTO_INCREMENT COMMENT '需求ID',
  `buyer_id` int NOT NULL COMMENT '采购商ID',
  `product_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '产品名称',
  `quantity` decimal(10, 2) NOT NULL COMMENT '需求数量',
  `delivery_province` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT '全国' COMMENT '收货省份',
  `is_nationwide` tinyint(1) NULL DEFAULT 0 COMMENT '是否全国范围',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `status` enum('open','closed') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT 'open' COMMENT '需求状态',
  `delivery_location` point NOT NULL COMMENT '收货位置',
  PRIMARY KEY (`demand_id`) USING BTREE,
  INDEX `buyer_id`(`buyer_id`) USING BTREE,
  INDEX `status_idx`(`status`) USING BTREE,
  INDEX `nationwide_idx`(`is_nationwide`) USING BTREE,
  SPATIAL INDEX `delivery_location_spatial_idx`(`delivery_location`),
  CONSTRAINT `purchase_demands_ibfk_1` FOREIGN KEY (`buyer_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for questions
-- ----------------------------
DROP TABLE IF EXISTS `questions`;
CREATE TABLE `questions`  (
  `question_id` int NOT NULL AUTO_INCREMENT COMMENT '问题ID',
  `farmer_id` int NULL DEFAULT NULL COMMENT '提问农户ID',
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '问题标题',
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '问题内容',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `status` enum('open','closed') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT 'open' COMMENT '问题状态',
  `answer_count` int NULL DEFAULT 0 COMMENT '回答数量',
  PRIMARY KEY (`question_id`) USING BTREE,
  INDEX `farmer_id`(`farmer_id`) USING BTREE,
  FULLTEXT INDEX `content_ft_idx`(`title`, `content`),
  CONSTRAINT `questions_ibfk_1` FOREIGN KEY (`farmer_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users`  (
  `user_id` int NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `username` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '用户名',
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '密码哈希',
  `role` enum('farmer','buyer','expert','admin') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '用户角色',
  `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '联系电话',
  `province` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '省份',
  `address_detail` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '详细地址',
  `avatar_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '头像路径',
  `join_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '注册时间',
  PRIMARY KEY (`user_id`) USING BTREE,
  UNIQUE INDEX `username`(`username`) USING BTREE,
  INDEX `role_idx`(`role`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

SET FOREIGN_KEY_CHECKS = 1;

