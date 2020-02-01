import 'package:flutter/material.dart';
import 'package:flutter_webview_plugin/flutter_webview_plugin.dart';
import 'package:geolocator/geolocator.dart';
import 'package:plan_it/WebPageView.dart';
class SOS extends StatefulWidget{
  @override
  State<StatefulWidget> createState(){
    return SOSstate();
  }
}
class SOSstate extends State<SOS>{
  Position _currentPosition;
  @override
  void initState()
  {
    super.initState();
    final Geolocator geolocator = Geolocator()..forceAndroidLocationManager;

    geolocator
        .getCurrentPosition(desiredAccuracy: LocationAccuracy.best)
        .then((Position position) {
      setState(() {
        _currentPosition = position;
      });
    }).catchError((e) {
      print(e);
    });
  }
  @override
  Widget build(BuildContext context)
  { 
    return (new WillPopScope(
           child: WebviewScaffold(
          
          url: "https://192.168.24.47:3000/police",
          withJavascript: true,
          appBar: new AppBar(
            title: new Text("Nearest Police Station"),
            leading: IconButton(
              icon: Icon(Icons.arrow_back),
              onPressed: ()
              {
                Navigator.push(context, MaterialPageRoute(builder:(context)=>WebPageView()));
              },
            ),
          ),
          ignoreSSLErrors: true,
          geolocationEnabled: true,
        ),
        onWillPop: ()
        {
          Navigator.push(context, MaterialPageRoute(builder:(context)=>WebPageView()));
        },
        )
        );
  }
}