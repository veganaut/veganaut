(function() {
    'use strict';
    angular.module('veganaut.app.main').factory('animations',

        function Animations() {
            this.animations = {
                'version_app': '0.11.13',
                'version_extension': '1.3.5',
                'version_runtime': '2.0.5',
                'groups': [{
                    'name': 'animation-01',
                    'timeScale': 1,
                    'timelines': [{
                        'type': 'dom',
                        'props': {
                            'opacity': {
                                '0s': '1'
                            },
                            'rotation': {
                                '0s': '37',
                                '1.997340425531915s': {
                                    'value': '0',
                                    'ease': 'Sine.easeOut'
                                }
                            },
                            'scale': {
                                '0s': '1',
                                '1.997340425531915s': {
                                    'value': '0.69',
                                    'ease': 'Sine.easeOut'
                                }
                            },
                            'xPercent': {
                                '0s': '11',
                                '1.997340425531915s': {
                                    'value': '-8',
                                    'ease': 'Power2.easeOut'
                                }
                            },
                            'yPercent': {
                                '0s': '29',
                                '1.997340425531915s': {
                                    'value': '107',
                                    'ease': 'Power2.easeOut'
                                }
                            }
                        },
                        'label': '#space-chicken',
                        'path': 'div[1]/object[1]',
                        'id': 'space-chicken'
                    }, {
                        'type': 'dom',
                        'props': {
                            'opacity': {
                                '0s': '1'
                            },
                            'rotation': {
                                '0s': '0',
                                '1.5545212765957446s': '-5'
                            },
                            'scale': {
                                '0s': '0.83',
                                '1.559840425531915s': {
                                    'value': '0.74',
                                    'ease': 'Power2.easeOut'
                                }
                            },
                            'xPercent': {
                                '0s': '129',
                                '1.5558510638297873s': {
                                    'value': '148',
                                    'ease': 'Power2.easeOut'
                                }
                            },
                            'yPercent': {
                                '0s': '-44',
                                '1.5571808510638299s': {
                                    'value': '24',
                                    'ease': 'Power2.easeOut'
                                }
                            }
                        },
                        'label': '#earth-group',
                        'path': 'div[1]/div[1]',
                        'id': 'earth-group'
                    }, {
                        'type': 'dom',
                        'props': {
                            'opacity': {
                                '0s': '0',
                                '1.2779255319148937s': '0',
                                '1.5053191489361701s': '1'
                            },
                            'xPercent': {
                                '0s': '43',
                                '1.2779255319148937s': '64.93',
                                '1.7074468085106382s': {
                                    'value': '43',
                                    'ease': 'Bounce.easeInOut'
                                }
                            },
                            'yPercent': {
                                '0s': '108',
                                '1.2765957446808511s': '140.83',
                                '1.7101063829787233s': {
                                    'value': '108',
                                    'ease': 'Bounce.easeInOut'
                                }
                            }
                        },
                        'label': '#heart-message',
                        'path': 'div[1]/div[1]/object[1]',
                        'id': 'heart-message'
                    }, {
                        'type': 'dom',
                        'props': {
                            'xPercent': {
                                '0s': '55',
                                '1.9960106382978724s': '46'
                            },
                            'yPercent': {
                                '0s': '238',
                                '1.9960106382978724s': '246'
                            }
                        },
                        'label': '#cloud',
                        'path': 'div[1]/div[1]/object[2]',
                        'id': 'cloud'
                    }, {
                        'type': 'dom',
                        'label': '#earth',
                        'path': 'div[1]/div[1]/object[3]',
                        'id': 'earth'
                    }, {
                        'type': 'dom',
                        'props': {
                            'opacity': {
                                '0.0013297872340425532s': '0',
                                '1.4082446808510638s': '0',
                                '1.9960106382978724s': '1'
                            },
                            'rotation': {
                                '1.4095744680851063s': '24.1',
                                '1.9960106382978724s': {
                                    'value': '10',
                                    'ease': 'Bounce.easeOut'
                                }
                            },
                            'scale': {
                                '1.4122340425531914s': '0.87',
                                '1.997340425531915s': {
                                    'value': '1.17',
                                    'ease': 'Bounce.easeOut'
                                }
                            },
                            'xPercent': {
                                '1.4162234042553192s': '43.41',
                                '1.9960106382978724s': {
                                    'value': '40',
                                    'ease': 'Bounce.easeOut'
                                }
                            },
                            'yPercent': {
                                '1.4148936170212767s': '-155.39',
                                '1.9960106382978724s': {
                                    'value': '-177',
                                    'ease': 'Bounce.easeOut'
                                }
                            }
                        },
                        'label': '#speech-bubble-big',
                        'path': 'div[1]/div[2]',
                        'id': 'speech-bubble-big'
                    }, {
                        'type': 'dom',
                        'props': {
                            'xPercent': {},
                            'yPercent': {}
                        },
                        'label': '#message',
                        'path': 'div[1]/div[2]/div[1]',
                        'id': 'message'
                    }, {
                        'type': 'dom',
                        'props': {
                            'rotation': {},
                            'scale': {},
                            'xPercent': {},
                            'yPercent': {}
                        },
                        'label': '#bubble-big',
                        'path': 'div[1]/div[2]/object[1]',
                        'id': 'bubble-big'
                    }, {
                        'type': 'dom',
                        'props': {
                            'opacity': {
                                '0s': '0.5'
                            },
                            'rotation': {
                                '0s': '15',
                                '1.997340425531915s': '-2'
                            },
                            'scale': {
                                '0s': '0.69',
                                '1.997340425531915s': '0.82'
                            },
                            'xPercent': {
                                '0s': '-12',
                                '1.997340425531915s': {
                                    'value': '-27',
                                    'ease': 'Power2.easeOut'
                                }
                            },
                            'yPercent': {
                                '0s': '-265',
                                '1.997340425531915s': {
                                    'value': '-256',
                                    'ease': 'Power2.easeOut'
                                }
                            }
                        },
                        'label': '#background-line_01',
                        'path': 'div[1]/object[3]',
                        'id': 'background-line_01'
                    }, {
                        'type': 'dom',
                        'props': {
                            'opacity': {
                                '0s': '0.5'
                            },
                            'scale': {
                                '0s': '1.11',
                                '1.9933510638297873s': {
                                    'value': '1.51',
                                    'ease': 'Power2.easeOut'
                                }
                            },
                            'xPercent': {
                                '0s': '-4',
                                '1.9933510638297873s': '-4'
                            },
                            'yPercent': {
                                '0s': '-333',
                                '1.9933510638297873s': {
                                    'value': '-306',
                                    'ease': 'Power2.easeOut'
                                }
                            }
                        },
                        'label': '#background-line_02',
                        'path': 'div[1]/object[4]',
                        'id': 'background-line_02'
                    }, {
                        'type': 'dom',
                        'props': {
                            'opacity': {
                                '0s': '1',
                                '1.9920212765957446s': '1'
                            },
                            'scale': {
                                '0s': '0.49',
                                '1.9920212765957446s': '0.75'
                            },
                            'xPercent': {
                                '0s': '479',
                                '1.428191489361702s': {
                                    'value': '33',
                                    'ease': 'Power2.easeIn'
                                }
                            },
                            'yPercent': {
                                '0s': '-487',
                                '1.4295212765957446s': {
                                    'value': '-980',
                                    'ease': 'Power2.easeIn'
                                }
                            }
                        },
                        'label': '#rocket',
                        'path': 'div[1]/object[2]',
                        'id': 'rocket'
                    }, {
                        'type': 'dom',
                        'props': {
                            'opacity': {
                                '0s': '0.02'
                            },
                            'scale': {
                                '0.851063829787234s': '1.2',
                                '1.9946808510638299s': {
                                    'value': '2.24',
                                    'ease': 'Cubic.easeInOut'
                                }
                            },
                            'xPercent': {
                                '0s': '0'
                            },
                            'yPercent': {
                                '0s': '-404'
                            }
                        },
                        'label': '#stars',
                        'path': 'div[1]/object[5]',
                        'id': 'stars'
                    }]
                }]
            };
            return this;
        }
    );
})(window.veganaut.mainModule);
