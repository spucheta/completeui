package RemoteControl;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.net.URISyntaxException;
import java.net.URL;
import java.util.Properties;

public class Configuration {

	public static final String PROPERTIES_FILE_NAME = "remotecontrol.properties";	
	public static final String SERVER_HOST = "serverHost";
	public static final String SERVER_PORT = "serverPort";
	public static final String TEST_HOST = "testHost";
	public static final String TEST_PORT = "testPort";	
	public static final String BASE_CONTEXT = "baseContext";
	public static final String TESTPATH= "testPath";
	
	
	public static void main(String[] args){
		Configuration app = new Configuration();
		app.initialize();
		System.out.println(app.serverHost());
		System.out.println(app.serverPort());
	}
	
	
    private Properties properties;
    private String propertiesFileName;

    public Configuration(String propertiesFileName) {
        this.propertiesFileName = propertiesFileName;
    }

    public Configuration() {
        this(PROPERTIES_FILE_NAME);
    }

    public void initialize() {
        properties = new Properties();
        
        FileInputStream fileInputStream;
        
        try {
        	URL pathToFile = this.getClass().getResource(propertiesFileName);
        	System.out.println("Reading remote control properties file at: "+pathToFile.getPath());
            fileInputStream = new FileInputStream(pathToFile.getPath());           
        }
        catch(FileNotFoundException e){
        	throw new RuntimeException("Remote control properties file can not be found at: " + propertiesFileName);
        }
        
        try{        	
            properties.load(fileInputStream);            
            fileInputStream.close();
        } catch (Exception e) {
            throw new RuntimeException("Could not load " + propertiesFileName);
        }
    }

    public String serverHost() {
        return properties.getProperty(SERVER_HOST);
    }

    public int serverPort() {    	
    	try{return Integer.parseInt(properties.getProperty(SERVER_PORT));
    	}catch(NumberFormatException e){return 4444;}
    }
    
    public String testHost(){
    	return properties.getProperty(TEST_HOST);
    }
    
    public int testPort(){
    	try{return Integer.parseInt(properties.getProperty(TEST_PORT));
    	}catch(NumberFormatException e){return 80;}
    }
  
    public String baseContext() {
        return properties.getProperty(BASE_CONTEXT);
    }
    
    public String testPath() {
        return properties.getProperty(TESTPATH);
    }
  }