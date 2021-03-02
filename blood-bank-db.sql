
create table hospital_data(
id         		int NOT NULL AUTO_INCREMENT PRIMARY KEY,
name       		varchar(100) NOT NULL,
email      		varchar(100) NOT NULL UNIQUE,
password   		varchar(500) NOT NULL,
contact    		varchar(20) NOT NULL
);


create table patient_data(
id          	int NOT NULL AUTO_INCREMENT PRIMARY KEY,
name        	varchar(100) NOT NULL,
email       	varchar(100) NOT NULL UNIQUE,
password    	varchar(500) NOT NULL,
contact     	varchar(20) NOT NULL,
blood_group 	enum('A+','A-','B+','B-','AB+','AB-','O+','O-')
);


create table blood_bank(
id                      	int NOT NULL AUTO_INCREMENT PRIMARY KEY,
hospital_id               	int,
a_positive                 	int unsigned DEFAULT 0,
a_negative                 	int unsigned DEFAULT 0,
b_positive                 	int unsigned DEFAULT 0,
b_negative                 	int unsigned DEFAULT 0,
ab_positive                	int unsigned DEFAULT 0,
ab_negative                 int unsigned DEFAULT 0,
o_positive                 	int unsigned DEFAULT 0,
o_negative                 	int unsigned DEFAULT 0,
available_blood_types		varchar(500)
);


create table blood_requests(
id                 	int NOT NULL AUTO_INCREMENT PRIMARY KEY,
patient_id          int,
hospital_id         int,
blood_type          enum('A+','A-','B+','B-','AB+','AB-','O+','O-'),
quantity            int unsigned NOT NULL,
approved			char(1) DEFAULT 'N',
time				timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE `blood_bank`
  ADD KEY `hospital_id` (`hospital_id`);

ALTER TABLE `blood_requests`
  ADD KEY `hospital_id` (`hospital_id`);

ALTER TABLE `blood_requests`
  ADD KEY `patient_id` (`patient_id`);

ALTER TABLE `blood_bank`
  ADD CONSTRAINT `hospital_bank` FOREIGN KEY (`hospital_id`) REFERENCES `hospital_data` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

 ALTER TABLE `blood_requests`
  ADD CONSTRAINT `hospital_requests` FOREIGN KEY (`hospital_id`) REFERENCES `hospital_data` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

 ALTER TABLE `blood_requests`
  ADD CONSTRAINT `patient_requests` FOREIGN KEY (`patient_id`) REFERENCES `patient_data` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

select * from patient_data;
select * from blood_requests;