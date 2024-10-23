<?php

return [
    'ctrl' => [
        'title' => 'LLL:EXT:typo3_todo_list/Resources/Private/Language/locallang_db.xlf:tx_typo3todolist_domain_model_task',
        'label' => 'title',
        'tstamp' => 'tstamp',
        'crdate' => 'crdate',
        'versioningWS' => true,
        'transOrigPointerField' => 'l10n_parent',
        'transOrigDiffSourceField' => 'l10n_diffsource',
        'languageField' => 'sys_language_uid',
        'origUid' => 't3_origuid',
        'delete' => 'deleted',
        'sortby' => 'sorting',
        'enablecolumns' => [
            'disabled' => 'hidden',
        ],
        'typeicon_classes' => [
            'default' => 'form-checkbox',
        ],
    ],
    'columns' => [
        'title' => [
            'label' => 'LLL:EXT:typo3_todo_list/Resources/Private/Language/locallang_db.xlf:tx_typo3todolist_domain_model_task.title',
            'config' => [
                'type' => 'input',
                'size' => 20,
                'eval' => 'trim',
                'required' => true,
                'max' => 255,
            ],
        ],
        'description' => [
            'label' => 'LLL:EXT:typo3_todo_list/Resources/Private/Language/locallang_db.xlf:tx_typo3todolist_domain_model_task.description',
            'config' => [
                'type' => 'text',
                'enableRichtext' => false,
            ],
        ],
        'due_date' => [
            'exclude' => true,
            'label' => 'LLL:EXT:typo3_todo_list/Resources/Private/Language/locallang_db.xlf:tx_typo3todolist_domain_model_task.due_date',
            'config' => [
                'type' => 'input',
                'renderType' => 'inputDateTime',
                'eval' => 'datetime,int',
                'default' => 0,
            ],
        ],
        'completed' => [
            'label' => 'LLL:EXT:typo3_todo_list/Resources/Private/Language/locallang_db.xlf:tx_typo3todolist_domain_model_task.completed',
            'config' => [
                'type' => 'check',
                'renderType' => 'checkboxToggle',
            ],
        ],
    ],
    'types' => [
        0 => ['showitem' => '
                --div--;LLL:EXT:core/Resources/Private/Language/Form/locallang_tabs.xlf:general,
                    title, description, due_date, completed,
                --div--;LLL:EXT:core/Resources/Private/Language/Form/locallang_tabs.xlf:access,
                    hidden,
                --div--;LLL:EXT:core/Resources/Private/Language/Form/locallang_tabs.xlf:extended,
        '],
    ],
];
