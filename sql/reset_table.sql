delete from choices;
delete from images;
delete from quiz;
DELETE FROM code_title;
ALTER TABLE `han_academy`.`code_title`
AUTO_INCREMENT = 0 ;
ALTER TABLE `han_academy`.`images` 
AUTO_INCREMENT = 0 ;
ALTER TABLE `han_academy`.`quiz` 
AUTO_INCREMENT = 0 ;
ALTER TABLE `han_academy`.`choices` 
AUTO_INCREMENT = 0 ;