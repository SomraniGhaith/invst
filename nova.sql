drop table reserve;
CREATE TABLE reserve (
  id int(11) NOT NULL AUTO_INCREMENT ,
  address_from varchar(255),
  address_to varchar(255),
  reserve_from double,
  reserve_to double,
  date  timestamp ,
  PRIMARY KEY (id)
);