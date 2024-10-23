create table tx_typo3todolist_domain_model_task
(
	title       varchar(255) not null,
	description text,
	due_date    int(11) unsigned default 0 not null,
	completed   tinyint(1) default 0 not null,
);
